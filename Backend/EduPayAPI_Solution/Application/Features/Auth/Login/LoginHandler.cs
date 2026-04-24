
namespace EduPayAPI.Application.Features.Auth.Login;

public class LoginHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository; // Giao tiếp với DB
    private readonly IJwtTokenService _jwtTokenService; // Dịch vụ tạo Token
    private readonly ILogger<LoginHandler> _logger;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    private readonly IUnitOfWork _unitOfWork;

    public LoginHandler(
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService,
        ILogger<LoginHandler> logger,
        IPasswordHasher passwordHasher,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork
        )
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
        _passwordHasher = passwordHasher;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<LoginResponse> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        // Dùng email từ request để tìm user trong DB
        var user = await _userRepository
            .GetByAccountAsync(request.Account, cancellationToken);

        //  Nếu không tìm thấy user, ném lỗi 401 
        if (user is null)
        {
            _logger.LogWarning("Login attempt failed for account: {Account}", request.Account);

            throw new UnauthorizedException("Account or password is invalid");
        }

        // Gọi hàm verifyPassword của User để kiểm tra
        //  Nếu sai mật khẩu, ném lỗi 401 
        if (!_passwordHasher.Verify(request.Password, user.Password))
        {
            _logger.LogWarning("Login attempt failed for account: {Account}", request.Account);

            throw new UnauthorizedException("Account or password is invalid");
        }

        var roleStrings = new List<string> { user.Role.ToString() };


        // Nếu mọi thứ đúng, tiến hành tạo chuỗi Access Token 
        var accessToken = _jwtTokenService.GenerateAccessToken(
            user.Id,
            user.Account,
            user.FullName,
            user.SchoolId,
            roleStrings
        );

        // revoke toàn bộ token cũ
        var oldTokens = await _refreshTokenRepository.GetByUserIdAsync(user.Id, cancellationToken);

        foreach (var t in oldTokens)
        {
            t.Revoke();
        }

        // Tạo chuỗi Refresh Token (dùng để lấy Access Token mới khi hết hạn)
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        var entity = new RefreshToken(
            user.Id,
            refreshToken,
            DateTime.UtcNow.AddDays(7)
        );

        await _refreshTokenRepository.AddAsync(entity, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "User {Account} logged in successfully",
            request.Account
        );

        // Đóng gói dữ liệu vào LoginResponse để trả về cho Client
        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = _jwtTokenService.AccessTokenExpirySeconds,
            User = new UserDto // Chuyển đổi từ Entity sang DTO để chỉ trả về thông tin cần thiết
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
