using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Projects.Commands.CreateProject;
using Portfolio.Application.Projects.Commands.DeleteProject;
using Portfolio.Application.Projects.Commands.UpdateProject;
using Portfolio.Application.Projects.Queries.GetProject;
using Portfolio.Application.Projects.Queries.GetProjectList;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;

namespace Portfolio.Api.Controllers;

/// <summary>
/// Project management endpoints
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[SwaggerTag("Project management and portfolio operations")]
public class ProjectsController : ControllerBase
{
    private readonly ILogger<ProjectsController> _logger;
    private readonly IMediator _mediator;
    
    public ProjectsController(ILogger<ProjectsController> logger, IMediator mediator)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    /// <summary>
    /// Create a new project
    /// </summary>
    /// <param name="command">Project creation details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created project ID</returns>
    /// <response code="201">Project created successfully</response>
    /// <response code="400">Invalid project data</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="403">Insufficient permissions</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [SwaggerOperation(
        Summary = "Create project",
        Description = "Creates a new project in the portfolio (Admin only)"
    )]
    [SwaggerResponse((int)HttpStatusCode.Created, "Project created", typeof(int))]
    [SwaggerResponse((int)HttpStatusCode.BadRequest, "Invalid project data")]
    [SwaggerResponse((int)HttpStatusCode.Unauthorized, "User not authenticated")]
    [SwaggerResponse((int)HttpStatusCode.Forbidden, "Insufficient permissions")]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating a new project with title: {Title}", command.Title);
        
        var result = await _mediator.Send(command, cancellationToken);
        
        if (result.IsFailure)
        {
            _logger.LogError("Failed to create project: {Error}", result.Error);
            return BadRequest(new { error = result.Error });
        }
        
        return CreatedAtAction(nameof(GetById), new { id = result.Value }, new { id = result.Value });
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectCommand command, CancellationToken cancellationToken)
    {
        if (command == null || command.Id != id)
        {
            _logger.LogError("UpdateProject command is null or ID mismatch.");
            return BadRequest("Invalid project data.");
        }

        _logger.LogInformation("Updating project with ID {ProjectId}.", id);
        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogError("Failed to update project: {Error}", result.Error);
            return BadRequest(result.Error);
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProject(int id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting project with ID {ProjectId}.", id);
        var result = await _mediator.Send(new DeleteProjectCommand(id), cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogError("Failed to delete project: {Error}", result.Error);
            return BadRequest(result.Error);
        }

        return NoContent();
    }

    /// <summary>
    /// Get all projects in the portfolio
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all projects</returns>
    /// <response code="200">Projects retrieved successfully</response>
    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all projects",
        Description = "Retrieves all projects in the portfolio"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "Projects retrieved", typeof(List<GetProjectListDto>))]
    [ProducesResponseType(typeof(List<GetProjectListDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching all projects.");
        var projects = await _mediator.Send(new GetProjectListQuery(), cancellationToken);
        return Ok(projects);
    }

    /// <summary>
    /// Get a specific project by ID
    /// </summary>
    /// <param name="id">Project ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Project details</returns>
    /// <response code="200">Project found</response>
    /// <response code="404">Project not found</response>
    [HttpGet("{id:int}")]
    [SwaggerOperation(
        Summary = "Get project by ID",
        Description = "Retrieves detailed information about a specific project"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "Project found", typeof(GetProjectByIdDto))]
    [SwaggerResponse((int)HttpStatusCode.NotFound, "Project not found")]
    [ProducesResponseType(typeof(GetProjectByIdDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching project with ID {ProjectId}.", id);
        var project = await _mediator.Send(new GetProjectByIdQuery(id), cancellationToken);
        
        if (project == null)
        {
            _logger.LogWarning("Project with ID {ProjectId} not found.", id);
            return NotFound(new { error = $"Project with ID {id} not found." });
        }
        
        return Ok(project);
    }
}
