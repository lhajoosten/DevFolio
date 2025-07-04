using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd();

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(u => u.IsEmailConfirmed)
            .IsRequired();

        builder.Property(u => u.EmailConfirmedAt);

        builder.Property(u => u.EmailConfirmationToken)
            .HasMaxLength(500);

        builder.Property(u => u.IsActive)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.Property(u => u.LastLoginAt);

        builder.Property(u => u.LockedOutUntil);

        builder.Property(u => u.FailedLoginAttempts)
            .IsRequired();

        // Configure Role as a value object (store only the ID)
        builder.Property(u => u.PrimaryRoleId)
            .IsRequired();

        // Ignore the navigation property - we'll handle Role as a value object
        builder.Ignore(u => u.PrimaryRole);

        // Configure one-to-one relationship with UserProfile
        builder.HasOne(u => u.UserProfile)
            .WithOne(up => up.User)
            .HasForeignKey<UserProfile>(up => up.UserId)
            .IsRequired(false) // Make it optional
            .OnDelete(DeleteBehavior.Cascade);

        // Add unique constraints
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.Username).IsUnique();
    }
}