using System;
using FluentValidation;

namespace Portfolio.Application.Projects.Commands.CreateProject;

public class CreateCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateCommandValidator()
    {
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

    private bool BeValidStartDate(DateTime? startDate)
    {
        if (!startDate.HasValue) return true;
        return startDate.Value >= DateTime.UtcNow.AddYears(-10) && startDate.Value <= DateTime.UtcNow.AddYears(1);
    }

    private bool HaveValidDateRange(CreateProjectCommand command)
    {
        if (!command.StartDate.HasValue || !command.EndDate.HasValue)
            return true;

        return command.EndDate.Value >= command.StartDate.Value;
    }
}
