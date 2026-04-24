namespace EduPayAPI.Application.Features.Auth.ForgotPassword;
public record ForgotPasswordCommand(string Email) 
    : IRequest<ForgotPasswordResponse>;