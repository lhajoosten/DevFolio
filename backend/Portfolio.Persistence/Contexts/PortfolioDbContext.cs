using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Persistence.Configurations;

namespace Portfolio.Persistence.Contexts;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}
