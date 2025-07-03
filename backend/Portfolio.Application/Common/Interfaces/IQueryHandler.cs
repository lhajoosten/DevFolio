using MediatR;
using Portfolio.Application.Base;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Interface for query handlers
/// </summary>
/// <typeparam name="TQuery">The type of the query</typeparam>
/// <typeparam name="TResponse">The type of the response</typeparam>
public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse>
{
}

