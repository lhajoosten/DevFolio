using MediatR;
using Portfolio.Application.Base;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Commands.CreateProject;

public class CreateProjectCommand : IRequest<Result<int>>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RepoUrl { get; set; } = string.Empty;
    public string[] TechStack { get; set; } = [];
    public string? ImageUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CreateProjectHandler(ICommandRepository<Project> commandRepository, IUnitOfWork unitOfWork)
    : IRequestHandler<CreateProjectCommand, Result<int>>
{
    private readonly ICommandRepository<Project> _commandRepository = commandRepository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Result<int>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = Project.Create(
            request.Title,
            request.Description,
            request.RepoUrl,
            request.TechStack,
            request.ImageUrl,
            request.StartDate,
            request.EndDate
        );

        try
        {
            var result = await _commandRepository.AddAsync(project, cancellationToken);
            return Result.Success(result.Id);
        }
        catch (Exception ex)
        {
            return Result.Failure<int>(ex.Message);
        }
    }
}