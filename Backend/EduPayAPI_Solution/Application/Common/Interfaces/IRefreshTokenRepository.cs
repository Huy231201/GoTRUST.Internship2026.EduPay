

namespace EduPayAPI.Application.Common.Interfaces;
public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken token, CancellationToken ct);
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct);
    Task<List<RefreshToken>> GetByUserIdAsync(Guid userId, CancellationToken ct);
}