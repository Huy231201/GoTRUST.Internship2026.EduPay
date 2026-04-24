
namespace EduPayAPI.Domain.Entities;

public class OtpCode
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = default!;
    public string Code { get; private set; } = default!;
    public DateTime ExpiredAt { get; private set; }

    public bool IsUsed { get; private set; }
    public int FailedAttempts { get; private set; }
    public bool IsActive { get; private set; }
    public bool IsLocked => FailedAttempts >= 5;

    // 🔥 NEW: reset token
    public string? ResetToken { get; private set; }
    public DateTime? ResetTokenExpiredAt { get; private set; }
    public bool IsResetTokenUsed { get; private set; }

    protected OtpCode() { }

    public OtpCode(string email, string code, DateTime expiredAt)
    {
        Id = Guid.NewGuid();
        Email = email;
        Code = code;
        ExpiredAt = expiredAt;

        IsUsed = false;
        FailedAttempts = 0;
        IsActive = true;
    }

    // =========================
    // DOMAIN METHODS
    // =========================

    public bool IsExpired()
        => ExpiredAt < DateTime.UtcNow;

    public bool IsValidCode(string inputCode)
        => Code == inputCode;

    public void IncreaseFailedAttempt()
    {
        if (IsLocked) return;
        FailedAttempts++;
    }

    public void MarkUsed()
    {
        IsUsed = true;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void Revoke()
    {
        IsUsed = true;
        IsActive = false;
    }

    // =========================
    // 🔥 RESET TOKEN LOGIC
    // =========================

    public void SetResetToken(string token, DateTime expiredAt)
    {
        ResetToken = token;
        ResetTokenExpiredAt = expiredAt;
        IsResetTokenUsed = false;

        Deactivate();
    }

    public bool IsResetTokenValid(string token)
    {
        return ResetToken == token
            && ResetTokenExpiredAt.HasValue
            && ResetTokenExpiredAt > DateTime.UtcNow
            && !IsResetTokenUsed; // thêm check used
    }

    public void ClearResetToken()
    {
        ResetToken = null;
        ResetTokenExpiredAt = null;
    }

    public bool IsResetTokenExpired()
    {
        return !ResetTokenExpiredAt.HasValue
            || ResetTokenExpiredAt < DateTime.UtcNow; // fix null crash
    }

    public void UseResetToken()
    {
        IsResetTokenUsed = true;

        // clear luôn để tránh reuse tuyệt đối
        ResetToken = null;
        ResetTokenExpiredAt = null;
    }

    // =========================
    // CORE VERIFY LOGIC
    // =========================

    public OtpVerifyResult Verify(string inputCode)
    {
        // đã dùng
        if (IsUsed)
            return OtpVerifyResult.Used;

        // hết hạn
        if (IsExpired())
        {
            Deactivate();
            return OtpVerifyResult.Expired;
        }

        // check LOCK trước
        if (IsLocked)
        {
            Deactivate();
            return OtpVerifyResult.Locked;
        }

        // check active sau
        if (!IsActive)
            return OtpVerifyResult.Locked;

        // sai OTP
        if (!IsValidCode(inputCode))
        {
            IncreaseFailedAttempt();

            if (IsLocked)
            {
                Deactivate();
                return OtpVerifyResult.Locked;
            }

            return OtpVerifyResult.Invalid;
        }

        // đúng OTP
        MarkUsed();
        return OtpVerifyResult.Success;
    }
}