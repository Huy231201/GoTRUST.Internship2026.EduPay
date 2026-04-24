

namespace EduPayAPI.Application.Features.Auth.ForgotPassword;

public class ForgotPasswordHandler
    : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IOtpRepository _otpRepository;
    private readonly IEmailService _emailService;
    private readonly IUnitOfWork _unitOfWork;

    public ForgotPasswordHandler(
        IUserRepository userRepository,
        IOtpRepository otpRepository,
        IEmailService emailService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _otpRepository = otpRepository;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ForgotPasswordResponse> Handle(
        ForgotPasswordCommand request,
        CancellationToken ct)
    {
        var user = await _userRepository
            .GetByAccountAsync(request.Email, ct);

        // tạo thời gian hết hạn dùng chung
        var expiredAt = DateTime.UtcNow.AddMinutes(3);
       

        // không leak info
        if (user is null)
            throw new BadRequestException("Email không tồn tại");

        // 1. deactivate OTP cũ
        await _otpRepository.DeactivateAllByEmailAsync(request.Email, ct);

        // 2. tạo OTP
        var otpCode = RandomNumberGenerator
            .GetInt32(100000, 999999)
            .ToString();

        var otp = new OtpCode(
            request.Email,
            otpCode,
            expiredAt
        );

        await _otpRepository.AddAsync(otp, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // 3. gửi email
        await _emailService.SendAsync(
            request.Email,
            "Mã OTP đặt lại mật khẩu",
            $"OTP của bạn là: {otpCode} (hết hạn 5 phút)"
        );

        // trả về cho FE dùng countdown
        return new ForgotPasswordResponse(expiredAt);
    }
}