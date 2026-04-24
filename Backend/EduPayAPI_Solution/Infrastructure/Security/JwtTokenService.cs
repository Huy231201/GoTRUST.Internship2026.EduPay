namespace EduPayAPI.Infrastructure.Security;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    //  Thời gian sống AccessToken (giây)
    public int AccessTokenExpirySeconds
        => int.Parse(_configuration["Jwt:ExpiresInSeconds"]!);

    public string GenerateAccessToken(
        Guid userId,
        string account,
        string fullName,
        Guid schoolId,
        IEnumerable<string> roles)
    {
        // Lấy secret key từ config
        var secretKey = _configuration["Jwt:SecretKey"]!;
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        // Biến chuỗi secretKey thành đối tượng dùng để mã hóa
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        // Claims – thông tin gắn trong JWT
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()), // user id
            new Claim(JwtRegisteredClaimNames.Email, account),
            new Claim("fullName", fullName), // custom claim
            new Claim("schoolId", schoolId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Thêm role
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // Tạo JWT
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddSeconds(AccessTokenExpirySeconds),
            signingCredentials: credentials
        );

        // Trả JWT dạng string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Tạo RefreshToken (chuỗi random an toàn)
    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }
}
