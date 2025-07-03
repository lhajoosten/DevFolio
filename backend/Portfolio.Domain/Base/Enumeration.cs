using System.Reflection;

namespace Portfolio.Domain.Base;

public abstract class Enumeration : IEquatable<Enumeration>, IComparable<Enumeration>
{
    public int Id { get; }
    public string Name { get; }

    protected Enumeration(int id, string name)
    {
        Id = id;
        Name = name;
    }

    public bool Equals(Enumeration? other)
    {
        return other is not null && GetType() == other.GetType() && Id == other.Id;
    }

    public override bool Equals(object? obj)
    {
        return obj is Enumeration other && Equals(other);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(GetType(), Id);
    }

    public int CompareTo(Enumeration? other)
    {
        return other is null ? 1 : Id.CompareTo(other.Id);
    }

    public static bool operator ==(Enumeration? left, Enumeration? right)
    {
        return left?.Equals(right) ?? right is null;
    }

    public static bool operator !=(Enumeration? left, Enumeration? right)
    {
        return !(left == right);
    }

    public static bool operator <(Enumeration? left, Enumeration? right)
    {
        return left?.CompareTo(right) < 0;
    }

    public static bool operator <=(Enumeration? left, Enumeration? right)
    {
        return left?.CompareTo(right) <= 0;
    }

    public static bool operator >(Enumeration? left, Enumeration? right)
    {
        return left?.CompareTo(right) > 0;
    }

    public static bool operator >=(Enumeration? left, Enumeration? right)
    {
        return left?.CompareTo(right) >= 0;
    }

    public override string ToString()
    {
        return Name;
    }

    public static IEnumerable<T> GetAll<T>() where T : Enumeration
    {
        var type = typeof(T);
        var fields = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly);

        foreach (var field in fields)
        {
            if (field.GetValue(null) is T enumeration)
            {
                yield return enumeration;
            }
        }
    }

    public static T? FromId<T>(int id) where T : Enumeration
    {
        return GetAll<T>().FirstOrDefault(e => e.Id == id);
    }

    public static T? FromName<T>(string name) where T : Enumeration
    {
        return GetAll<T>().FirstOrDefault(e => 
            string.Equals(e.Name, name, StringComparison.OrdinalIgnoreCase));
    }

    public static bool TryFromId<T>(int id, out T? enumeration) where T : Enumeration
    {
        enumeration = FromId<T>(id);
        return enumeration is not null;
    }

    public static bool TryFromName<T>(string name, out T? enumeration) where T : Enumeration
    {
        enumeration = FromName<T>(name);
        return enumeration is not null;
    }

    public static int Count<T>() where T : Enumeration
    {
        return GetAll<T>().Count();
    }

    public static bool IsValidId<T>(int id) where T : Enumeration
    {
        return GetAll<T>().Any(e => e.Id == id);
    }

    public static bool IsValidName<T>(string name) where T : Enumeration
    {
        return GetAll<T>().Any(e => 
            string.Equals(e.Name, name, StringComparison.OrdinalIgnoreCase));
    }
}