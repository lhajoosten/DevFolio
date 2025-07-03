using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Base;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Persistence.Contexts;

namespace Portfolio.Persistence.Repositories;

public class QueryRepository<T>(PortfolioDbContext context) : IQueryRepository<T> where T : BaseEntity<int>
{
    private readonly PortfolioDbContext _context = context;
    private readonly DbSet<T> _dbSet = context.Set<T>();

    public async Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    public async Task<IEnumerable<T>> ListAllAsync(CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<T?> FirstAsync(Func<T, bool> predicate, CancellationToken ct = default)
    {
        return await Task.Run(() => _dbSet
            .AsNoTracking()
            .FirstOrDefault(predicate), ct);
    }

    public async Task<IEnumerable<T>> ListAsync(Func<T, bool> predicate, CancellationToken ct = default)
    {
        return await Task.Run(() => _dbSet
            .AsNoTracking()
            .Where(predicate)
            .ToList(), ct);
    }
}
