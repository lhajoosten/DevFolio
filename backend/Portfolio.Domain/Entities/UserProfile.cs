using Ardalis.GuardClauses;
using Portfolio.Domain.Base;

namespace Portfolio.Domain.Entities;

public class UserProfile : BaseEntity<int>
{
    private string _firstName = string.Empty;
    private string _lastName = string.Empty;

    public string FirstName
    {
        get => _firstName;
        set => _firstName = Guard.Against.NullOrEmpty(value, nameof(FirstName));
    }

    public string LastName
    {
        get => _lastName;
        set => _lastName = Guard.Against.NullOrEmpty(value, nameof(LastName));
    }

    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }

    // Foreign Key
    public int UserId { get; private set; }
    
    // Navigation Property
    public User User { get; set; } = null!;

    // Computed Property
    public string FullName => $"{FirstName} {LastName}".Trim();
    public int? Age => DateOfBirth?.CalculateAge();

    // Constructors
    protected UserProfile() { }

    private UserProfile(int userId, string firstName, string lastName)
    {
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
    }

    // Factory Method
    public static UserProfile Create(int userId, string firstName, string lastName)
    {
        return new UserProfile(userId, firstName, lastName);
    }

    // Business Methods
    public void UpdateBasicInfo(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public void UpdateBio(string? bio)
    {
        if (bio?.Length > 1000)
            throw new ArgumentException("Bio cannot exceed 1000 characters.");
        Bio = bio;
    }

    public void UpdateProfilePicture(string? profilePictureUrl)
    {
        if (profilePictureUrl != null && !Uri.TryCreate(profilePictureUrl, UriKind.Absolute, out _))
            throw new ArgumentException("Invalid profile picture URL.");
        ProfilePictureUrl = profilePictureUrl;
    }

    public void UpdateContactInfo(string? location, string? websiteUrl, string? linkedInUrl, string? gitHubUrl)
    {
        Location = location;
        
        if (websiteUrl != null && !Uri.TryCreate(websiteUrl, UriKind.Absolute, out _))
            throw new ArgumentException("Invalid website URL.");
        WebsiteUrl = websiteUrl;
        
        if (linkedInUrl != null && !Uri.TryCreate(linkedInUrl, UriKind.Absolute, out _))
            throw new ArgumentException("Invalid LinkedIn URL.");
        LinkedInUrl = linkedInUrl;
        
        if (gitHubUrl != null && !Uri.TryCreate(gitHubUrl, UriKind.Absolute, out _))
            throw new ArgumentException("Invalid GitHub URL.");
        GitHubUrl = gitHubUrl;
    }

    public void UpdateDateOfBirth(DateTime? dateOfBirth)
    {
        if (dateOfBirth.HasValue)
        {
            if (dateOfBirth.Value > DateTime.UtcNow)
                throw new ArgumentException("Date of birth cannot be in the future.");
            
            if (dateOfBirth.Value.CalculateAge() < 13)
                throw new ArgumentException("User must be at least 13 years old.");
        }
        
        DateOfBirth = dateOfBirth;
    }
}

// Extension method for age calculation
public static class DateTimeExtensions
{
    public static int CalculateAge(this DateTime dateOfBirth)
    {
        var today = DateTime.UtcNow;
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }
}