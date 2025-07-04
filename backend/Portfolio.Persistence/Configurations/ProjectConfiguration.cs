using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Portfolio.Domain.Entities;
using System.Text.Json;

namespace Portfolio.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .ValueGeneratedOnAdd();

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(p => p.RepoUrl)
            .IsRequired()
            .HasMaxLength(500);

        // Fix for CS9175: Use a ValueConverter instead of inline lambda expressions
        var techStackConverter = new ValueConverter<string[], string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<string>()
        );

        builder.Property(p => p.TechStack)
            .IsRequired()
            .HasConversion(techStackConverter)
            .HasMaxLength(2000);

        builder.Property(p => p.ImageUrl)
            .HasMaxLength(500);

        builder.Property(p => p.StartDate)
            .IsRequired();

        builder.Property(p => p.EndDate);

        // Configure computed properties to be ignored in database
        builder.Ignore(p => p.IsCompleted);
        builder.Ignore(p => p.IsActive);
        builder.Ignore(p => p.Duration);
        builder.Ignore(p => p.DurationInDays);
        builder.Ignore(p => p.Status); // ProjectStatus is computed, not stored

        // Add index for better query performance
        builder.HasIndex(p => p.Title);
        builder.HasIndex(p => p.StartDate);
    }
}