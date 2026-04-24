namespace EduPayAPI.Application.Features.Auth.Logout;
public record LogoutCommand(string RefreshToken) : IRequest<bool>;