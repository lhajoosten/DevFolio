using System;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Queries.GetProject;

public class GetProjectByIdDto : IMapFrom<Project>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RepoUrl { get; set; } = string.Empty;
    public string[] TechStack { get; set; } = Array.Empty<string>();
    public string? ImageUrl { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ProjectStatus Status { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsActive { get; set; }
    public TimeSpan Duration { get; set; }
    public int DurationInDays { get; set; }
}
