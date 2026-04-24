namespace EduPayAPI.Domain.Entities;
public class RefreshToken
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Token { get; private set; } = default!;
    public DateTime ExpiredAt { get; private set; }
    public bool IsRevoked { get; private set; }

    protected RefreshToken() { }

    public RefreshToken(Guid userId, string token, DateTime expiredAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Token = token;
        ExpiredAt = expiredAt;
        IsRevoked = false;
    }

    public bool IsExpired() => ExpiredAt < DateTime.UtcNow;

    public void Revoke() => IsRevoked = true;
}