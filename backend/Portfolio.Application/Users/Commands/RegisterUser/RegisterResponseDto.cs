using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Users.Commands.RegisterUser;

public class RegisterResponseDto : IMapFrom<User>
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool IsEmailConfirmed { get; set; }
    public string Token { get; set; } = string.Empty;
}