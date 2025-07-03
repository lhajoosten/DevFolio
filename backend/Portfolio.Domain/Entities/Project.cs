using Ardalis.GuardClauses;
using Portfolio.Domain.Base;

namespace Portfolio.Domain.Entities;

public class Project : BaseEntity<int>
{
    private string _title = string.Empty;
    private string _description = string.Empty;
    private string _repoUrl = string.Empty;
    private string[] _techStack = [];
    private DateTime _startDate;
    private DateTime? _endDate;

    // Properties with validation
    public string Title
    {
        get => _title;
        set => _title = Guard.Against.NullOrEmpty(value, nameof(Title));
    }

    public string Description
    {
        get => _description;
        set => _description = Guard.Against.NullOrEmpty(value, nameof(Description));
    }

    public string RepoUrl
    {
        get => _repoUrl;
        set => _repoUrl = Guard.Against.NullOrEmpty(value, nameof(RepoUrl));
    }

    public string[] TechStack
    {
        get => _techStack;
        set
        {
            Guard.Against.Null(value, nameof(TechStack));
            Guard.Against.OutOfRange(value.Length, nameof(TechStack), 1, 10);
            _techStack = value;
        }
    }

    public string? ImageUrl { get; set; }

    public DateTime StartDate
    {
        get => _startDate;
        set
        {
            ValidateDateRange(value, _endDate);
            _startDate = value;
        }
    }

    public DateTime? EndDate
    {
        get => _endDate;
        set
        {
            ValidateDateRange(_startDate, value);
            _endDate = value;
        }
    }

    // Computed properties
    public bool IsCompleted => EndDate.HasValue;
    public bool IsActive => !IsCompleted;
    public TimeSpan Duration => (EndDate ?? DateTime.UtcNow) - StartDate;
    public int DurationInDays => (int)Duration.TotalDays;

    // Status enum
    public ProjectStatus Status => EndDate switch
    {
        null when StartDate > DateTime.UtcNow => ProjectStatus.Planned,
        null => ProjectStatus.InProgress,
        var endDate when endDate <= DateTime.UtcNow => ProjectStatus.Completed,
        _ => ProjectStatus.InProgress
    };

    // Constructors
    protected Project() { }

    private Project(string title, string description, string repoUrl, string[] techStack, 
        string? imageUrl, DateTime startDate, DateTime? endDate)
    {
        SetProperties(title, description, repoUrl, techStack, imageUrl, startDate, endDate);
    }

    // Factory methods
    public static Project Create(
        string title, 
        string description, 
        string repoUrl, 
        string[] techStack, 
        string? imageUrl = null,
        DateTime? startDate = null, 
        DateTime? endDate = null)
    {
        return new Project(title, description, repoUrl, techStack, imageUrl, 
            startDate ?? DateTime.UtcNow, endDate);
    }

    public static Project CreateCompleted(
        string title,
        string description,
        string repoUrl,
        string[] techStack,
        DateTime startDate,
        DateTime endDate,
        string? imageUrl = null)
    {
        return new Project(title, description, repoUrl, techStack, imageUrl, startDate, endDate);
    }

    // Business methods
    public void UpdateDetails(string title, string description, string? imageUrl = null)
    {
        Title = title;
        Description = description;
        if (imageUrl is not null)
        {
            ImageUrl = imageUrl;
        }
    }

    public void UpdateTechStack(params string[] techStack)
    {
        TechStack = techStack;
    }

    public void MarkAsCompleted(DateTime? completionDate = null)
    {
        EndDate = completionDate ?? DateTime.UtcNow;
    }

    public void ExtendProject(DateTime newEndDate)
    {
        if (IsCompleted)
        {
            throw new InvalidOperationException("Cannot extend a completed project.");
        }
        
        EndDate = newEndDate;
    }

    public bool HasTechnology(string technology)
    {
        return TechStack.Contains(technology, StringComparer.OrdinalIgnoreCase);
    }

    public void AddTechnology(string technology)
    {
        Guard.Against.NullOrEmpty(technology, nameof(technology));
        
        if (HasTechnology(technology))
        {
            return; // Already exists
        }

        if (TechStack.Length >= 10)
        {
            throw new InvalidOperationException("Cannot add more than 10 technologies.");
        }

        TechStack = [.. TechStack, technology];
    }

    public void RemoveTechnology(string technology)
    {
        Guard.Against.NullOrEmpty(technology, nameof(technology));
        
        var newTechStack = TechStack.Where(t => 
            !string.Equals(t, technology, StringComparison.OrdinalIgnoreCase)).ToArray();
        
        if (newTechStack.Length == 0)
        {
            throw new InvalidOperationException("Project must have at least one technology.");
        }

        TechStack = newTechStack;
    }

    // Private helper methods
    private void SetProperties(string title, string description, string repoUrl, 
        string[] techStack, string? imageUrl, DateTime startDate, DateTime? endDate)
    {
        Title = title;
        Description = description;
        RepoUrl = repoUrl;
        TechStack = techStack;
        ImageUrl = imageUrl;
        StartDate = startDate;
        EndDate = endDate;
    }

    private static void ValidateDateRange(DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate < startDate)
        {
            throw new ArgumentException("EndDate cannot be before StartDate.");
        }
    }

    public override string ToString()
    {
        return $"{Title} ({Status}) - {string.Join(", ", TechStack)}";
    }
}
