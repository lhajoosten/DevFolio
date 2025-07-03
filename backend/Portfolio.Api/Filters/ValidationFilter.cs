using Ardalis.GuardClauses;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Portfolio.Api.Filters;

public class ValidationFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        try
        {
            await next();
        }
        catch (ValidationException ex)
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

            context.Result = new BadRequestObjectResult(problemDetails);
        }
        catch (NotFoundException ex)
        {
            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resource Not Found",
                Detail = ex.Message,
                Instance = context.HttpContext.Request.Path
            };

            context.Result = new NotFoundObjectResult(problemDetails);
        }
    }
}