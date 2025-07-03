using AutoMapper;
using MediatR;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Queries.GetProject;

public class GetProjectByIdQuery : IRequest<GetProjectByIdDto?>
{
    public int Id { get; set; }

    public GetProjectByIdQuery(int id)
    {
        Id = id;
    }
}

public class GetProjectByIdHandler(IQueryRepository<Project> queryRepository, IMapper mapper) 
    : IRequestHandler<GetProjectByIdQuery, GetProjectByIdDto?>
{
    private readonly IQueryRepository<Project> _queryRepository = queryRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<GetProjectByIdDto?> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var project = await _queryRepository.GetByIdAsync(request.Id, cancellationToken);
        return project == null ? null : _mapper.Map<GetProjectByIdDto>(project);
    }
}
