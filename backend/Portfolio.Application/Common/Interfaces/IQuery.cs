using MediatR;
using Portfolio.Application.Base;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Marker interface for queries
/// </summary>
/// <typeparam name="TResponse">The type of the response</typeparam>
public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
}
