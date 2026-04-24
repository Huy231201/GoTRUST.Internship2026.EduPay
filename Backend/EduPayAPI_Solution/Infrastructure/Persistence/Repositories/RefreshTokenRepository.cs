namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(RefreshToken token, CancellationToken ct)
    {
        await _context.RefreshTokens.AddAsync(token, ct);
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == token, ct);
    }

    public async Task<List<RefreshToken>> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await _context.RefreshTokens
            .Where(x => x.UserId == userId && !x.IsRevoked)
            .ToListAsync(ct);
    }
}