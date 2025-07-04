using Ardalis.GuardClauses;
using Portfolio.Domain.Base;

namespace Portfolio.Domain.Entities;

public class User : BaseEntity<int>
{
    private string _email = string.Empty;
    private string _username = string.Empty;
    private string _passwordHash = string.Empty;

    // Properties with validation
    public string Email
    {
        get => _email;
        set
        {
            Guard.Against.NullOrEmpty(value, nameof(Email));
            Guard.Against.InvalidFormat(value, nameof(Email), @"^[^@\s]+@[^@\s]+\.[^@\s]+$", "Invalid email format");
            _email = value.ToLowerInvariant();
        }
    }

    public string Username
    {
        get => _username;
        set
        {
            Guard.Against.NullOrEmpty(value, nameof(Username));
            Guard.Against.InvalidInput(value, nameof(Username), x => x.Length >= 3 && x.Length <= 50, "Username must be between 3 and 50 characters");
            _username = value.ToLowerInvariant();
        }
    }

    public string PasswordHash
    {
        get => _passwordHash;
        private set => _passwordHash = Guard.Against.NullOrEmpty(value, nameof(PasswordHash));
    }

    public bool IsEmailConfirmed { get; private set; }
    public DateTime? EmailConfirmedAt { get; private set; }
    public string? EmailConfirmationToken { get; private set; }
    
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    public DateTime? LockedOutUntil { get; private set; }
    public int FailedLoginAttempts { get; private set; }

    // Foreign Keys
    public int PrimaryRoleId { get; private set; }

    // Computed Navigation Property (not stored in DB)
    public Role PrimaryRole => Role.FromId<Role>(PrimaryRoleId) ?? Role.User;
    
    // Navigation Properties
    public UserProfile? UserProfile { get; set; }

    // Constructors
    protected User() 
    {
        CreatedAt = DateTime.UtcNow;
    }

    private User(string email, string username, string passwordHash, Role role) : this()
    {
        Email = email;
        Username = username;
        PasswordHash = passwordHash;
        PrimaryRoleId = role.Id;
    }

    // Factory Methods
    public static User Create(string email, string username, string passwordHash, Role? role = null)
    {
        return new User(email, username, passwordHash, role ?? Role.User);
    }

    // Business Methods
    public void UpdatePasswordHash(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        FailedLoginAttempts = 0;
    }

    public void ConfirmEmail()
    {
        IsEmailConfirmed = true;
        EmailConfirmedAt = DateTime.UtcNow;
        EmailConfirmationToken = null;
    }

    public void SetEmailConfirmationToken(string token)
    {
        EmailConfirmationToken = Guard.Against.NullOrEmpty(token, nameof(token));
    }

    public void RecordSuccessfulLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        LockedOutUntil = null;
    }

    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        
        if (FailedLoginAttempts >= 5)
        {
            LockedOutUntil = DateTime.UtcNow.AddMinutes(15);
        }
    }

    public bool IsLockedOut => LockedOutUntil.HasValue && LockedOutUntil > DateTime.UtcNow;

    public void UnlockAccount()
    {
        LockedOutUntil = null;
        FailedLoginAttempts = 0;
    }

    public void Activate()
    {
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void ChangeRole(Role newRole)
    {
        Guard.Against.Null(newRole, nameof(newRole));
        PrimaryRoleId = newRole.Id;
    }
}