
namespace EduPayAPI.API.Endpoints.Auth;

public class LogoutEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/logout", async (
            LogoutRequest request,
            IMediator mediator,
            CancellationToken ct) =>
        {
            await mediator.Send(
                new LogoutCommand(request.RefreshToken), ct);

            return Results.Ok();
        })
        .WithTags("Auth");
    }
}