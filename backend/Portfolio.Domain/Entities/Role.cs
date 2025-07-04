using Portfolio.Domain.Base;

namespace Portfolio.Domain.Entities;

public class Role : Enumeration
{
    public static readonly Role Guest = new(1, "Guest");
    public static readonly Role User = new(2, "User");
    public static readonly Role Admin = new(3, "Admin");

    private Role(int id, string name) : base(id, name) { }

    // Helper methods for common role checks
    public bool IsAdmin => this == Admin;
    public bool IsUser => this == User;
    public bool IsGuest => this == Guest;

    // Check if role has higher or equal privileges
    public bool HasPrivilegeLevel(Role requiredRole)
    {
        return Id >= requiredRole.Id;
    }
}