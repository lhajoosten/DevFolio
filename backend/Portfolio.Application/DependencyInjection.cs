using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Common.Behaviors;
using System.Reflection;

namespace Portfolio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }

    private static void AddValidatorsFromAssembly(this IServiceCollection services, Assembly assembly)
    {
        var validatorTypes = assembly.GetTypes()
            .Where(t => 
                t.IsClass && 
                !t.IsAbstract && 
                t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IValidator<>)));
     
        foreach (var validatorType in validatorTypes)
        {
            services.AddTransient(validatorType);
        }
    }
}
