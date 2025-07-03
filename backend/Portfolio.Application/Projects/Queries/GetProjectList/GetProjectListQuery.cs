using AutoMapper;
using MediatR;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Projects.Queries.GetProjectList;

public class GetProjectListQuery : IRequest<List<GetProjectListDto>> { }

public class GetProjectListHandler(IQueryRepository<Project> queryRepository, IMapper mapper) 
    : IRequestHandler<GetProjectListQuery, List<GetProjectListDto>>
{
    private readonly IQueryRepository<Project> _queryRepository = queryRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<List<GetProjectListDto>> Handle(GetProjectListQuery request, CancellationToken cancellationToken)
    {
        var projects = await _queryRepository.ListAllAsync(cancellationToken);
        return _mapper.Map<List<GetProjectListDto>>(projects);
    }
}
