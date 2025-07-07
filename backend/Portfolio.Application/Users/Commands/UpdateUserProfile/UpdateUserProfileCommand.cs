using AutoMapper;
using MediatR;
using Portfolio.Application.Common;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Commands.UpdateUserProfile;

public class UpdateUserProfileCommand : IRequest<Result<UpdateUserProfileResponseDto>>
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
}

public class UpdateUserProfileCommandHandler(
    IQueryRepository<User> userQueryRepository,
    IQueryRepository<UserProfile> profileQueryRepository,
    ICommandRepository<User> userCommandRepository,
    ICommandRepository<UserProfile> profileCommandRepository,
    IMapper mapper) : IRequestHandler<UpdateUserProfileCommand, Result<UpdateUserProfileResponseDto>>
{
    private readonly IQueryRepository<User> _userQueryRepository = userQueryRepository;
    private readonly IQueryRepository<UserProfile> _profileQueryRepository = profileQueryRepository;
    private readonly ICommandRepository<User> _userCommandRepository = userCommandRepository;
    private readonly ICommandRepository<UserProfile> _profileCommandRepository = profileCommandRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<UpdateUserProfileResponseDto>> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userQueryRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
                return Result.Failure<UpdateUserProfileResponseDto>("User not found.");

            var profile = await _profileQueryRepository.FirstAsync(
                p => p.UserId == request.UserId, cancellationToken);

            if (profile == null)
            {
                // Create new profile
                profile = UserProfile.Create(user.Id, request.FirstName, request.LastName);
            }
            else
            {
                // Update existing profile
                profile.UpdateBasicInfo(request.FirstName, request.LastName);
            }

            // Update profile fields
            profile.UpdateBio(request.Bio);
            profile.UpdateProfilePicture(request.ProfilePictureUrl);
            profile.UpdateContactInfo(request.Location, request.WebsiteUrl, request.LinkedInUrl, request.GitHubUrl);
            profile.UpdateDateOfBirth(request.DateOfBirth);

            // Save changes
            if (profile.Id == 0)
            {
                await _profileCommandRepository.AddAsync(profile, cancellationToken);
            }
            else
            {
                await _profileCommandRepository.UpdateAsync(profile, cancellationToken);
            }

            var result = _mapper.Map<UpdateUserProfileResponseDto>(profile);
            return Result.Success(result);
        }
        catch (Exception ex)
        {
            return Result.Failure<UpdateUserProfileResponseDto>(ex.Message);
        }
    }
}
