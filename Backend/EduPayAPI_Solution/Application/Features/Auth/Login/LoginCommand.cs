
namespace EduPayAPI.Application.Features.Auth.Login;

public record LoginCommand(
    string Account,
    string Password
) : IRequest<LoginResponse>;
