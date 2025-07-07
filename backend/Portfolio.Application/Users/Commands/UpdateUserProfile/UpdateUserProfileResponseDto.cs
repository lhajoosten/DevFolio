using AutoMapper;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Commands.UpdateUserProfile;

public class UpdateUserProfileResponseDto : IMapFrom<UserProfile>
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int? Age { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UserProfile, UpdateUserProfileResponseDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => s.FullName))
            .ForMember(d => d.Age, opt => opt.MapFrom(s => s.Age));
    }
}
