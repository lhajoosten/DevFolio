using AutoMapper;
using MediatR;
using Portfolio.Application.Common;
using Portfolio.Application.Common.Services;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Commands.RegisterUser;

public class RegisterCommand : IRequest<Result<RegisterResponseDto>>
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class RegisterUserCommandHandler(
    ICommandRepository<User> userCommandRepository,
    IQueryRepository<User> userQueryRepository,
    ICommandRepository<UserProfile> profileCommandRepository,
    IPasswordHashingService passwordHashingService,
    IAuthenticationService authService,
    IMapper mapper) : IRequestHandler<RegisterCommand, Result<RegisterResponseDto>>
{
    private readonly ICommandRepository<User> _userCommandRepository = userCommandRepository;
    private readonly IQueryRepository<User> _userQueryRepository = userQueryRepository;
    private readonly ICommandRepository<UserProfile> _profileCommandRepository = profileCommandRepository;
    private readonly IPasswordHashingService _passwordHashingService = passwordHashingService;
    private readonly IAuthenticationService _authService = authService;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<RegisterResponseDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if user already exists
            var existingUserByEmail = await _userQueryRepository.FirstAsync(
                u => u.Email.Equals(request.Email, StringComparison.InvariantCultureIgnoreCase), cancellationToken);

            if (existingUserByEmail != null)
                return Result.Failure<RegisterResponseDto>("A user with this email already exists.");

            var existingUserByUsername = await _userQueryRepository.FirstAsync(
                u => u.Username.Equals(request.Username, StringComparison.InvariantCultureIgnoreCase), cancellationToken);

            if (existingUserByUsername != null)
                return Result.Failure<RegisterResponseDto>("A user with this username already exists.");

            // Hash password
            var passwordHash = _passwordHashingService.HashPassword(request.Password);

            // Create user
            var user = User.Create(request.Email, request.Username, passwordHash);
            var createdUser = await _userCommandRepository.AddAsync(user, cancellationToken);

            // Create user profile
            var userProfile = UserProfile.Create(createdUser.Id, request.FirstName, request.LastName);
            await _profileCommandRepository.AddAsync(userProfile, cancellationToken);

            // Generate JWT token using the User object overload
            var token = _authService.GenerateAccessToken(createdUser);

            // Map to response DTO
            var response = _mapper.Map<RegisterResponseDto>(createdUser);
            response.FullName = $"{request.FirstName} {request.LastName}";
            response.Token = token;

            return Result.Success(response);
        }
        catch (Exception ex)
        {
            return Result.Failure<RegisterResponseDto>(ex.Message);
        }
    }
}