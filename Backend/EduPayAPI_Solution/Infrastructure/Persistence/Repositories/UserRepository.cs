namespace EduPayAPI.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository thao tác dữ liệu User (chỉ truy cập DB)
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lấy user theo email (dùng cho login)
    /// </summary>
    public async Task<User?> GetByAccountAsync(
        string account,
        CancellationToken cancellationToken)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Account == account, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken)
    {
        await _context.Users.AddAsync(user, cancellationToken);
    }

    public async Task<bool> ExistsByAccountAsync(string account, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AnyAsync(x => x.Account == account, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }
}
