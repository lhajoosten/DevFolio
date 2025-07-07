using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common.Services;
using Portfolio.Application.Users.Commands.LoginUser;
using Portfolio.Application.Users.Commands.RegisterUser;
using Portfolio.Application.Users.Commands.UpdateUserProfile;
using Portfolio.Application.Users.Queries.GetCurrentUser;
using Portfolio.Application.Users.Queries.GetUserProfile;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;

namespace Portfolio.Api.Controllers;

/// <summary>
/// Authentication and user management endpoints
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[SwaggerTag("Authentication and user management")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(ILogger<AuthController> logger, IMediator mediator, ICurrentUserService currentUserService)
    {
        _logger = logger;
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Register a new user account
    /// </summary>
    /// <param name="command">User registration details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Newly created user with authentication token</returns>
    /// <response code="201">User successfully registered</response>
    /// <response code="400">Invalid input or user already exists</response>
    [HttpPost("register")]
    [SwaggerOperation(
        Summary = "Register new user",
        Description = "Creates a new user account with the provided information"
    )]
    [SwaggerResponse((int)HttpStatusCode.Created, "User successfully registered", typeof(RegisterResponseDto))]
    [SwaggerResponse((int)HttpStatusCode.BadRequest, "Invalid input or user already exists")]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Registering new user with email: {Email}", command.Email);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Registration failed: {Error}", result.Error);
            return BadRequest(new { error = result.Error });
        }

        _logger.LogInformation("User registered successfully with ID: {UserId}", result.Value.Id);
        return Created("", result.Value);
    }

    /// <summary>
    /// Authenticate user and get access token
    /// </summary>
    /// <param name="command">Login credentials</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User information with authentication token</returns>
    /// <response code="200">Login successful</response>
    /// <response code="400">Invalid input</response>
    /// <response code="401">Invalid credentials or account locked</response>
    [HttpPost("login")]
    [SwaggerOperation(
        Summary = "User login",
        Description = "Authenticates user credentials and returns an access token"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "Login successful", typeof(LoginResponseDto))]
    [SwaggerResponse((int)HttpStatusCode.BadRequest, "Invalid input")]
    [SwaggerResponse((int)HttpStatusCode.Unauthorized, "Invalid credentials or account locked")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginUserCommand command, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Login attempt for: {EmailOrUsername}", command.EmailOrUsername);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Login failed for {EmailOrUsername}: {Error}", command.EmailOrUsername, result.Error);
            return Unauthorized(new { error = result.Error });
        }

        _logger.LogInformation("User logged in successfully: {UserId}", result.Value.Id);
        return Ok(result.Value);
    }

    /// <summary>
    /// Get current authenticated user information
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Current user profile information</returns>
    /// <response code="200">User information retrieved successfully</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">User not found</response>
    [HttpGet("me")]
    [Authorize]
    [SwaggerOperation(
        Summary = "Get current user",
        Description = "Retrieves the profile information of the currently authenticated user"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "User information retrieved", typeof(GetCurrentUserDto))]
    [SwaggerResponse((int)HttpStatusCode.Unauthorized, "User not authenticated")]
    [SwaggerResponse((int)HttpStatusCode.NotFound, "User not found")]
    [ProducesResponseType(typeof(GetCurrentUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        // Use the CurrentUserService instead of manually parsing claims
        if (!_currentUserService.IsAuthenticated || !_currentUserService.UserId.HasValue)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        var userId = _currentUserService.UserId.Value;
        _logger.LogInformation("Getting current user information for ID: {UserId}", userId);

        var result = await _mediator.Send(new GetCurrentUserQuery(userId), cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Failed to get current user: {Error}", result.Error);
            return NotFound(new { error = result.Error });
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Get current user's profile information
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Current user's complete profile information</returns>
    /// <response code="200">Profile information retrieved successfully</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">User or profile not found</response>
    [HttpGet("profile")]
    [Authorize]
    [SwaggerOperation(
        Summary = "Get current user's profile",
        Description = "Retrieves the complete profile information of the currently authenticated user"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "Profile information retrieved", typeof(GetCurrentUserDto))]
    [SwaggerResponse((int)HttpStatusCode.Unauthorized, "User not authenticated")]
    [SwaggerResponse((int)HttpStatusCode.NotFound, "User or profile not found")]
    [ProducesResponseType(typeof(GetCurrentUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        if (!_currentUserService.IsAuthenticated || !_currentUserService.UserId.HasValue)
        {
            _logger.LogWarning("Unauthorized access attempt to GetProfile");
            return Unauthorized(new { error = "User not authenticated" });
        }

        var userId = _currentUserService.UserId.Value;
        _logger.LogInformation("Getting profile information for user ID: {UserId}", userId);

        var result = await _mediator.Send(new GetUserProfileQuery(userId), cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Failed to get user profile: {Error}", result.Error);
            return NotFound(new { error = result.Error });
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Update current user's profile information
    /// </summary>
    /// <param name="command">Profile update details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated profile information</returns>
    /// <response code="200">Profile updated successfully</response>
    /// <response code="400">Invalid input or validation error</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">User not found</response>
    [HttpPut("profile")]
    [Authorize]
    [SwaggerOperation(
        Summary = "Update user profile",
        Description = "Updates the profile information of the currently authenticated user"
    )]
    [SwaggerResponse((int)HttpStatusCode.OK, "Profile updated successfully", typeof(UpdateUserProfileResponseDto))]
    [SwaggerResponse((int)HttpStatusCode.BadRequest, "Invalid input or validation error")]
    [SwaggerResponse((int)HttpStatusCode.Unauthorized, "User not authenticated")]
    [SwaggerResponse((int)HttpStatusCode.NotFound, "User not found")]
    [ProducesResponseType(typeof(UpdateUserProfileResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileCommand command, CancellationToken cancellationToken)
    {
        if (!_currentUserService.IsAuthenticated || !_currentUserService.UserId.HasValue)
        {
            _logger.LogWarning("Unauthorized access attempt to UpdateProfile");
            return Unauthorized(new { error = "User not authenticated" });
        }

        var userId = _currentUserService.UserId.Value;
        command.UserId = userId;

        _logger.LogInformation("Updating profile for user ID: {UserId}", userId);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Failed to update user profile: {Error}", result.Error);
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Value);
    }
}