using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Base;
using Portfolio.Domain.Base.Interfaces;
using Portfolio.Persistence.Contexts;

namespace Portfolio.Persistence.Repositories;

public class CommandRepository<T>(PortfolioDbContext context, IUnitOfWork unitOfWork) : ICommandRepository<T> where T : BaseEntity<int>
{
    private readonly PortfolioDbContext _context = context;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly DbSet<T> _dbSet = context.Set<T>();

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        var entry = await _dbSet.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return entry.Entity;
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
