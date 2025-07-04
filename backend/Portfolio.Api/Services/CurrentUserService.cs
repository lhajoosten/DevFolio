using Portfolio.Application.Common.Services;
using System.Security.Claims;

namespace Portfolio.Api.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? UserId
        {
            get
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                ?? _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value
                                ?? _httpContextAccessor.HttpContext?.User?.FindFirst("userId")?.Value;

                return int.TryParse(userIdClaim, out var userId) ? userId : null;
            }
        }

        public string? Username
        {
            get
            {
                return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value
                       ?? _httpContextAccessor.HttpContext?.User?.FindFirst("username")?.Value;
            }
        }

        public string? Email
        {
            get
            {
                return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value
                       ?? _httpContextAccessor.HttpContext?.User?.FindFirst("email")?.Value;
            }
        }

        public string? Role
        {
            get
            {
                return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value
                       ?? _httpContextAccessor.HttpContext?.User?.FindFirst("role")?.Value;
            }
        }

        public bool IsAuthenticated
        {
            get
            {
                return _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
            }
        }

        public bool IsInRole(string role)
        {
            if (string.IsNullOrEmpty(role))
                return false;

            return _httpContextAccessor.HttpContext?.User?.IsInRole(role) ?? false;
        }
    }
}
