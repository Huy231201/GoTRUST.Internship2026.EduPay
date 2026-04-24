

namespace EduPayAPI.Application.Features.Auth.VerifyOtp;

public record VerifyOtpCommand(
    string Email,
    string Otp
) : IRequest<string>;