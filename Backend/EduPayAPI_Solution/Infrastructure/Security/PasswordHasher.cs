

namespace EduPayAPI.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    // dummy user NON-NULL
    private static readonly object _user = new();

    private readonly PasswordHasher<object> _hasher = new();

    public string Hash(string password)
    {
        return _hasher.HashPassword(_user, password);
    }

    public bool Verify(string password, string hashedPassword)
    {
        var result = _hasher.VerifyHashedPassword(
            _user,
            hashedPassword,
            password
        );

        return result == PasswordVerificationResult.Success
            || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}
