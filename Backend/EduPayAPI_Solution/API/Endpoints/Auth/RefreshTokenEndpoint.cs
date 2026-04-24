
namespace EduPayAPI.API.Endpoints.Auth;

public class RefreshTokenEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/refresh-token", async (
            RefreshTokenRequest request,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var command = new RefreshTokenCommand(request.RefreshToken);

            var result = await mediator.Send(command, ct);

            return Results.Ok(result);
        })
        .AllowAnonymous()
        .WithTags("Auth");
    }
}