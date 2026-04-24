namespace EduPayAPI.Application.Common.Interfaces;

public interface IOtpRepository
{
    Task AddAsync(OtpCode otp, CancellationToken ct);

    Task<OtpCode?> GetValidOtpAsync(string email, string code, CancellationToken ct);

    Task<OtpCode?> GetUsedOtpAsync(string email, CancellationToken ct);

    Task<OtpCode?> GetByEmailAsync(
          string email,
          CancellationToken ct);

    Task<OtpCode?> GetLatestByEmailAsync(string email, CancellationToken ct);

    Task DeactivateAllByEmailAsync(string email, CancellationToken ct);

    Task<OtpCode?> GetByResetTokenAsync(string resetToken, CancellationToken ct);
}