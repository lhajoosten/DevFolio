using MediatR;
using Portfolio.Application.Common;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Commands.DeleteProject;

public class DeleteProjectCommand : IRequest<Result>
{
    public int Id { get; set; }

    public DeleteProjectCommand(int id)
    {
        Id = id;
    }
}

public class DeleteProjectHandler(
    ICommandRepository<Project> commandRepository,
    IQueryRepository<Project> queryRepository) : IRequestHandler<DeleteProjectCommand, Result>
{
    private readonly ICommandRepository<Project> _commandRepository = commandRepository;
    private readonly IQueryRepository<Project> _queryRepository = queryRepository;

    public async Task<Result> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _queryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null) return Result.Failure($"Project with ID {request.Id} not found.");

        await _commandRepository.DeleteAsync(project, cancellationToken);

        return Result.Success($"Project with ID {request.Id} deleted successfully.");
    }
}
