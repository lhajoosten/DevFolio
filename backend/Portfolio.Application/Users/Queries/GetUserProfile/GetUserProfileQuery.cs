using AutoMapper;
using MediatR;
using Portfolio.Application.Common;
using Portfolio.Application.Users.Queries.GetCurrentUser;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Queries.GetUserProfile;

public class GetUserProfileQuery : IRequest<Result<GetCurrentUserDto>>
{
    public int UserId { get; set; }

    public GetUserProfileQuery(int userId)
    {
        UserId = userId;
    }
}

public class GetUserProfileQueryHandler(
    IQueryRepository<User> userQueryRepository,
    IQueryRepository<UserProfile> profileQueryRepository,
    IMapper mapper) : IRequestHandler<GetUserProfileQuery, Result<GetCurrentUserDto>>
{
    private readonly IQueryRepository<User> _userQueryRepository = userQueryRepository;
    private readonly IQueryRepository<UserProfile> _profileQueryRepository = profileQueryRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<GetCurrentUserDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userQueryRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
                return Result.Failure<GetCurrentUserDto>("User not found.");

            var profile = await _profileQueryRepository.FirstAsync(
                p => p.UserId == request.UserId, cancellationToken);

            var userDto = _mapper.Map<GetCurrentUserDto>(user);
            userDto.Role = user.PrimaryRole.Name;

            if (profile != null)
            {
                userDto.Profile = _mapper.Map<UserProfileDto>(profile);
            }

            return Result.Success(userDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<GetCurrentUserDto>(ex.Message);
        }
    }
}
