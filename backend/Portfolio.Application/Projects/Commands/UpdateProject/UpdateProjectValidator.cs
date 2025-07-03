using FluentValidation;

namespace Portfolio.Application.Projects.Commands.UpdateProject;

public class UpdateProjectValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Valid project ID is required.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(200)
            .WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters.");

        RuleFor(x => x.RepoUrl)
            .NotEmpty()
            .WithMessage("Repository URL is required.")
            .Must(BeValidUrl)
            .WithMessage("Repository URL must be a valid URL.");

        RuleFor(x => x.TechStack)
            .NotEmpty()
            .WithMessage("At least one technology is required.")
            .Must(x => x.Length <= 10)
            .WithMessage("Maximum 10 technologies allowed.");

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrlOrNull)
            .WithMessage("Image URL must be a valid URL when provided.");

        RuleFor(x => x.StartDate)
            .Must(BeValidStartDate)
            .WithMessage("Start date cannot be in the future beyond reasonable planning.");

        RuleFor(x => x)
            .Must(HaveValidDateRange)
            .WithMessage("End date cannot be before start date.")
            .When(x => x.EndDate.HasValue);
    }

    private bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }

    private bool BeValidUrlOrNull(string? url)
    {
        return url == null || Uri.TryCreate(url, UriKind.Absolute, out _);
    }

    private bool BeValidStartDate(DateTime startDate)
    {
        return startDate >= DateTime.UtcNow.AddYears(-10) && startDate <= DateTime.UtcNow.AddYears(1);
    }

    private bool HaveValidDateRange(UpdateProjectCommand command)
    {
        if (!command.EndDate.HasValue)
            return true;

        return command.EndDate.Value >= command.StartDate;
    }
}
