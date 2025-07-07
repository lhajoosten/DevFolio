using AutoMapper;
using MediatR;
using Portfolio.Application.Common;
using Portfolio.Application.Common.Services;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Commands.LoginUser;

public class LoginUserCommand : IRequest<Result<LoginResponseDto>>
{
    public string EmailOrUsername { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; }
}

public class LoginUserCommandHandler(
    ICommandRepository<User> userCommandRepository,
    IQueryRepository<User> userQueryRepository,
    IPasswordHashingService passwordHashingService,
    IAuthenticationService authService,
    IMapper mapper) : IRequestHandler<LoginUserCommand, Result<LoginResponseDto>>
{
    private readonly ICommandRepository<User> _userCommandRepository = userCommandRepository;
    private readonly IQueryRepository<User> _userQueryRepository = userQueryRepository;
    private readonly IPasswordHashingService _passwordHashingService = passwordHashingService;
    private readonly IAuthenticationService _authService = authService;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<LoginResponseDto>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Find user by email or username
            var user = await _userQueryRepository.FirstAsync(
                u => u.Email.Equals(request.EmailOrUsername, StringComparison.InvariantCultureIgnoreCase) ||
                     u.Username.Equals(request.EmailOrUsername, StringComparison.InvariantCultureIgnoreCase),
                cancellationToken);

            if (user == null)
                return Result.Failure<LoginResponseDto>("Invalid email/username or password.");

            // Check if account is locked
            if (user.IsLockedOut)
                return Result.Failure<LoginResponseDto>("Account is temporarily locked due to too many failed login attempts.");

            // Check if account is active
            if (!user.IsActive)
                return Result.Failure<LoginResponseDto>("Account is deactivated.");

            // Verify password
            if (!_passwordHashingService.VerifyPassword(request.Password, user.PasswordHash))
            {
                // Record failed login attempt
                user.RecordFailedLogin();
                await _userCommandRepository.UpdateAsync(user, cancellationToken);

                return Result.Failure<LoginResponseDto>("Invalid email/username or password.");
            }

            // Record successful login
            user.RecordSuccessfulLogin();
            await _userCommandRepository.UpdateAsync(user, cancellationToken);

            // Generate JWT token using the User object overload
            var token = _authService.GenerateAccessToken(user, request.RememberMe);
            var tokenExpiry = _authService.GetTokenExpiry(request.RememberMe);

            // Map to response DTO
            var response = _mapper.Map<LoginResponseDto>(user);
            response.Role = user.PrimaryRole.Name;
            response.Token = token;
            response.ExpiresAt = tokenExpiry;

            return Result.Success(response);
        }
        catch (Exception ex)
        {
            return Result.Failure<LoginResponseDto>(ex.Message);
        }
    }
}