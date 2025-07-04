using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Persistence.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("UserProfiles");

        builder.HasKey(up => up.Id);

        builder.Property(up => up.Id)
            .ValueGeneratedOnAdd();

        builder.Property(up => up.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(up => up.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(up => up.Bio)
            .HasMaxLength(1000);

        builder.Property(up => up.ProfilePictureUrl)
            .HasMaxLength(500);

        builder.Property(up => up.Location)
            .HasMaxLength(200);

        builder.Property(up => up.WebsiteUrl)
            .HasMaxLength(500);

        builder.Property(up => up.LinkedInUrl)
            .HasMaxLength(500);

        builder.Property(up => up.GitHubUrl)
            .HasMaxLength(500);

        builder.Property(up => up.UserId)
            .IsRequired();
    }
}