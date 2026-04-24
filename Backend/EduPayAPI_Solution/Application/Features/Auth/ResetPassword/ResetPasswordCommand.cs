

namespace EduPayAPI.Application.Features.Auth.ResetPassword;

public record ResetPasswordCommand(
    string ResetToken,
    string NewPassword
) : IRequest<bool>;