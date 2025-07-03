namespace Portfolio.Domain.Base.Interfaces;

public interface ICommandRepository<T> where T : BaseEntity<int>
{
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}

