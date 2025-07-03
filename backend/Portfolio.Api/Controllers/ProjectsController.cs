using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Projects.Commands.CreateProject;
using Portfolio.Application.Projects.Commands.DeleteProject;
using Portfolio.Application.Projects.Commands.UpdateProject;
using Portfolio.Application.Projects.Queries.GetProject;
using Portfolio.Application.Projects.Queries.GetProjectList;

namespace Portfolio.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Consumes("application/json")]
    public class ProjectsController : ControllerBase
    {
        private readonly ILogger<ProjectsController> _logger;
        private readonly IMediator _mediator;
        
        public ProjectsController(ILogger<ProjectsController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        // POST, Update, Delete Authorized
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                _logger.LogError("CreateProject command is null.");
                return BadRequest("Invalid project data.");
            }

            _logger.LogInformation("Creating a new project.");
            var result = await _mediator.Send(command, cancellationToken);

            if (result.IsFailure)
            {
                _logger.LogError("Failed to create project: {Error}", result.Error);
                return BadRequest(result.Error);
            }

            _logger.LogInformation("Project created successfully.");
            return CreatedAtAction(nameof(GetById), new { id = result.Value }, null);
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

        // GET Not Authorized

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching all projects.");
            var projects = await _mediator.Send(new GetProjectListQuery(), cancellationToken);
            return Ok(projects);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching project with ID {ProjectId}.", id);
            var project = await _mediator.Send(new GetProjectByIdQuery(id), cancellationToken);
            if (project == null)
            {
                _logger.LogWarning("Project with ID {ProjectId} not found.", id);
                return NotFound();
            }
            return Ok(project);
        }
    }
}
