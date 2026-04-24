namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class OtpRepository : IOtpRepository
{
    private readonly AppDbContext _context;

    public OtpRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OtpCode otp, CancellationToken ct)
    {
        await _context.OtpCodes.AddAsync(otp, ct);
    }

    public async Task<OtpCode?> GetValidOtpAsync(
    string email,
    string code,
    CancellationToken ct)
    {
        return await _context.OtpCodes
            .Where(x =>
                x.Email == email &&
                x.Code == code &&
                !x.IsUsed)
            .OrderByDescending(x => x.ExpiredAt)
            .FirstOrDefaultAsync(ct);
    }

    public async Task<OtpCode?> GetUsedOtpAsync(
    string email,
    CancellationToken ct)
    {
        return await _context.OtpCodes
            .Where(x => x.Email == email && x.IsUsed)
            .OrderByDescending(x => x.ExpiredAt)
            .FirstOrDefaultAsync(ct);
    }

    public async Task<OtpCode?> GetByEmailAsync(
    string email,
    CancellationToken ct)
    {
        return await _context.OtpCodes
            .FirstOrDefaultAsync(x =>
                x.Email == email,
                ct);
    }

    public async Task<OtpCode?> GetLatestByEmailAsync(
    string email,
    CancellationToken ct)
    {
        return await _context.OtpCodes
            .Where(x => x.Email == email)
            .OrderByDescending(x => x.ExpiredAt)
            .FirstOrDefaultAsync(ct);
    }
    public async Task DeactivateAllByEmailAsync(string email, CancellationToken ct)
    {
        var otps = await _context.OtpCodes
            .Where(x => x.Email == email && x.IsActive)
            .OrderByDescending(x => x.ExpiredAt)
            .ToListAsync(ct);

        foreach (var otp in otps)
        {
            otp.Deactivate();
        }
    }

    public async Task<OtpCode?> GetByResetTokenAsync(
    string resetToken,
    CancellationToken ct)
    {
        return await _context.OtpCodes
            .Where(x => x.ResetToken == resetToken)
            .FirstOrDefaultAsync(ct);
    }
}