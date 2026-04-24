

namespace EduPayAPI.Application.Features.Auth.RefreshTokens;
public class RefreshTokenHandler
    : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IRefreshTokenRepository _repo;
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwt;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenHandler(
        IRefreshTokenRepository repo,
        IUserRepository userRepository,
        IJwtTokenService jwt,
        IUnitOfWork unitOfWork)
    {
        _repo = repo;
        _userRepository = userRepository;
        _jwt = jwt;
        _unitOfWork = unitOfWork;
    }

    public async Task<LoginResponse> Handle(
        RefreshTokenCommand request,
        CancellationToken ct)
    {
        var token = await _repo.GetByTokenAsync(request.RefreshToken, ct);

        if (token is null || token.IsExpired() || token.IsRevoked)
            throw new UnauthorizedException("Refresh token is invalid");

        var user = await _userRepository.GetByIdAsync(token.UserId, ct);

        if (user is null)
            throw new UnauthorizedException("User is not found");

        // revoke token cũ
        token.Revoke();

        // tạo refresh token mới
        var newRefreshToken = _jwt.GenerateRefreshToken();

        var newEntity = new RefreshToken(
            user.Id,
            newRefreshToken,
            DateTime.UtcNow.AddDays(7)
        );

        await _repo.AddAsync(newEntity, ct);

        // tạo access token mới
        var roleStrings = new List<string> { user.Role.ToString() };

        var accessToken = _jwt.GenerateAccessToken(
            user.Id,
            user.Account,
            user.FullName,
            user.SchoolId,
            roleStrings
        );

        await _unitOfWork.SaveChangesAsync(ct);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = _jwt.AccessTokenExpirySeconds,
            User = new UserDto
            {
                Id = user.Id,
                Account = user.Account,
                FullName = user.FullName,
                SchoolId = user.SchoolId,
                Roles = roleStrings
            }
        };
    }
}