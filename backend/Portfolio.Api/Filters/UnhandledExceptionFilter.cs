using Ardalis.GuardClauses;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Portfolio.Api.Filters;

public class UnhandledExceptionFilter : IExceptionFilter
{
    private readonly ILogger<UnhandledExceptionFilter> _logger;

    public UnhandledExceptionFilter(ILogger<UnhandledExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;
        _logger.LogError(exception, "Unhandled exception occurred.");

        var problemDetails = exception switch
        {
            ValidationException validationEx => CreateValidationProblemDetails(validationEx, context),
            NotFoundException notFoundEx => CreateNotFoundProblemDetails(notFoundEx, context),
            ArgumentException argEx => CreateBadRequestProblemDetails(argEx, context),
            InvalidOperationException invalidOpEx => CreateBadRequestProblemDetails(invalidOpEx, context),
            _ => CreateInternalServerErrorProblemDetails(context)
        };

        context.Result = new ObjectResult(problemDetails)
        {
            StatusCode = problemDetails.Status
        };

        context.ExceptionHandled = true;
    }

    private static ValidationProblemDetails CreateValidationProblemDetails(ValidationException ex, ExceptionContext context)
    {
        var problemDetails = new ValidationProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Error",
            Detail = "One or more validation errors occurred.",
            Instance = context.HttpContext.Request.Path
        };

        foreach (var error in ex.Errors)
        {
            problemDetails.Errors.Add(error.PropertyName, new[] { error.ErrorMessage });
        }

        return problemDetails;
    }

    private static ProblemDetails CreateNotFoundProblemDetails(NotFoundException ex, ExceptionContext context)
    {
        return new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Resource Not Found",
            Detail = ex.Message,
            Instance = context.HttpContext.Request.Path
        };
    }

    private static ProblemDetails CreateBadRequestProblemDetails(Exception ex, ExceptionContext context)
    {
        return new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Bad Request",
            Detail = ex.Message,
            Instance = context.HttpContext.Request.Path
        };
    }

    private static ProblemDetails CreateInternalServerErrorProblemDetails(ExceptionContext context)
    {
        return new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = "An unexpected error occurred. Please try again later.",
            Instance = context.HttpContext.Request.Path
        };
    }
}