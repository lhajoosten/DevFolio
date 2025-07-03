namespace Portfolio.Domain.Base;

public abstract class BaseEntity<T> : IEquatable<BaseEntity<T>>
    where T : struct
{
    public T Id { get; set; }

    protected BaseEntity() { }

    protected BaseEntity(T id)
    {
        Id = id;
    }

    public bool Equals(BaseEntity<T>? other)
    {
        return other is not null && EqualityComparer<T>.Default.Equals(Id, other.Id);
    }

    public override bool Equals(object? obj)
    {
        return obj is BaseEntity<T> other && Equals(other);
    }

    public override int GetHashCode()
    {
        return EqualityComparer<T>.Default.GetHashCode(Id);
    }

    public static bool operator ==(BaseEntity<T>? left, BaseEntity<T>? right)
    {
        return left?.Equals(right) ?? right is null;
    }

    public static bool operator !=(BaseEntity<T>? left, BaseEntity<T>? right)
    {
        return !(left == right);
    }
}