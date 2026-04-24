

namespace EduPayAPI.API.Endpoints.Auth;

public class LoginEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/login", async (
            LoginRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new LoginCommand(
                request.Account,
                request.Password
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Auth");
    }
}
