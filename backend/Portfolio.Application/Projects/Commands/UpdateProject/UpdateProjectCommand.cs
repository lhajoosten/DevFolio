using Ardalis.GuardClauses;
using MediatR;
using Portfolio.Application.Base;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Commands.UpdateProject;

public class UpdateProjectCommand : IRequest<Result>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RepoUrl { get; set; } = string.Empty;
    public string[] TechStack { get; set; } = Array.Empty<string>();
    public string? ImageUrl { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}


public class UpdateProjectHandler(
    ICommandRepository<Project> commandRepository,
    IQueryRepository<Project> queryRepository) : IRequestHandler<UpdateProjectCommand, Result>
{
    private readonly ICommandRepository<Project> _commandRepository = commandRepository;
    private readonly IQueryRepository<Project> _queryRepository = queryRepository;

    public async Task<Result> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _queryRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Entity with ID {request.Id} not found.", "Project");

        // Update project properties
        project.UpdateDetails(request.Title, request.Description, request.ImageUrl);
        project.UpdateTechStack(request.TechStack);

        // Update dates if needed
        if (request.StartDate != project.StartDate)
        {
            project.StartDate = request.StartDate;
        }

        if (request.EndDate != project.EndDate)
        {
            project.EndDate = request.EndDate;
        }

        try
        {
            await _commandRepository.UpdateAsync(project, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(ex.Message);
        }
    }
}