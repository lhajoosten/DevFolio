namespace Portfolio.Domain.Base.Interfaces;

public interface IQueryRepository<T> where T : BaseEntity<int>
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<T>> ListAllAsync(CancellationToken ct = default);
    
    Task<T?> FirstAsync(Func<T, bool> predicate, CancellationToken ct = default);
    Task<IEnumerable<T>> ListAsync(Func<T, bool> predicate, CancellationToken ct = default);
}