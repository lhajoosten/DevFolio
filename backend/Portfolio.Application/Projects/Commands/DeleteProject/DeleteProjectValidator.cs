using FluentValidation;

namespace Portfolio.Application.Projects.Commands.DeleteProject;

public class DeleteProjectValidator : AbstractValidator<DeleteProjectCommand>
{
    public DeleteProjectValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Valid project ID is required.");
    }
}
