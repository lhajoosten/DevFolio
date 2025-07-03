using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Persistence.Contexts;
using Portfolio.Persistence.Repositories;

namespace Portfolio.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Add Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Add Generic Repositories
        services.AddScoped(typeof(IQueryRepository<>), typeof(QueryRepository<>));
        services.AddScoped(typeof(ICommandRepository<>), typeof(CommandRepository<>));

        return services;
    }
}