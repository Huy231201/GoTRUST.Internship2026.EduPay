


namespace EduPayAPI.Application.Features.Auth.VerifyOtp;

public class VerifyOtpHandler
    : IRequestHandler<VerifyOtpCommand, string>
{
    private readonly IOtpRepository _otpRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VerifyOtpHandler(
        IOtpRepository otpRepository,
        IUnitOfWork unitOfWork)
    {
        _otpRepository = otpRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<string> Handle(
        VerifyOtpCommand request,
        CancellationToken ct)
    {
        var otp = await _otpRepository
            .GetLatestByEmailAsync(request.Email, ct);

        if (otp is null)
            throw new BadRequestException("OTP không hợp lệ");

        var result = otp.Verify(request.Otp);

        // ❗ xử lý lỗi trước
        switch (result)
        {
            case OtpVerifyResult.Invalid:
                throw new BadRequestException("OTP không hợp lệ");

            case OtpVerifyResult.Locked:
                throw new BadRequestException("OTP bị khóa do nhập sai 5 lần");

            case OtpVerifyResult.Expired:
                throw new BadRequestException("OTP đã hết hạn");

            case OtpVerifyResult.Used:
                throw new BadRequestException("OTP đã được sử dụng");
        }

        // ✅ SUCCESS → tạo resetToken
        var resetToken = Guid.NewGuid().ToString();

        var expiredAt = DateTime.UtcNow.AddMinutes(10);

        otp.SetResetToken(resetToken, expiredAt);

        await _unitOfWork.SaveChangesAsync(ct);

        return resetToken; // 🔥 trả về cho FE
    }
}