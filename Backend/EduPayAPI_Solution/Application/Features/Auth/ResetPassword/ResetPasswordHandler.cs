
namespace EduPayAPI.Application.Features.Auth.ResetPassword;

public class ResetPasswordHandler
    : IRequestHandler<ResetPasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IOtpRepository _otpRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public ResetPasswordHandler(
        IUserRepository userRepository,
        IOtpRepository otpRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _otpRepository = otpRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        ResetPasswordCommand request,
        CancellationToken ct)
    {
        // tìm theo resetToken
        var otp = await _otpRepository
            .GetByResetTokenAsync(request.ResetToken, ct);

        if (otp is null)
            throw new BadRequestException("Token không hợp lệ");

        // validate token (gộp)
        if (!otp.IsResetTokenValid(request.ResetToken) || otp.IsResetTokenUsed)
            throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn");

        // lấy user từ email trong OTP
        var user = await _userRepository
            .GetByAccountAsync(otp.Email, ct);

        if (user is null)
            throw new BadRequestException("User không tồn tại");

        // tránh trùng password
        if (_passwordHasher.Verify(request.NewPassword, user.Password))
            throw new BadRequestException("Mật khẩu mới không được trùng mật khẩu cũ");

        var newHashedPassword = _passwordHasher.Hash(request.NewPassword);

        user.ChangePassword(newHashedPassword);

        // revoke token
        otp.UseResetToken();
        otp.ClearResetToken();

        await _unitOfWork.SaveChangesAsync(ct);

        return true;
    }
}