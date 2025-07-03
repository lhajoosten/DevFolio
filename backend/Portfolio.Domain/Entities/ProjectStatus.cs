using Portfolio.Domain.Base;

namespace Portfolio.Domain.Entities;

public class ProjectStatus : Enumeration
{
    public static ProjectStatus NotStarted => new(1, "Not Started");
    public static ProjectStatus Planned => new(2, "Planned");
    public static ProjectStatus InProgress => new(3, "In Progress");
    public static ProjectStatus Completed => new(4, "Completed");
    public static ProjectStatus OnHold => new(5, "On Hold");

    private ProjectStatus(int id, string name) : base(id, name)
    {
    }
}

