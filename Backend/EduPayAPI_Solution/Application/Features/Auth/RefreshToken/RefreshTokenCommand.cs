
namespace EduPayAPI.Application.Features.Auth.RefreshTokens;

public record RefreshTokenCommand(string RefreshToken)
    : IRequest<LoginResponse>;