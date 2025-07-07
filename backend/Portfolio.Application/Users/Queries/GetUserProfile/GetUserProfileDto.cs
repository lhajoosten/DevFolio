using AutoMapper;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.Users.Queries.GetCurrentUser;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Queries.GetUserProfile;

public class GetUserProfileDto : IMapFrom<User>
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public bool IsEmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; }
    public string Role { get; set; } = string.Empty;
    
    // Profile Information
    public UserProfileDto? Profile { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, GetUserProfileDto>()
            .ForMember(d => d.Role, opt => opt.MapFrom(s => s.PrimaryRole.Name))
            .ForMember(d => d.Profile, opt => opt.MapFrom(s => s.UserProfile));
    }
}
