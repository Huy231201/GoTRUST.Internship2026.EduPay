

namespace EduPayAPI.API.Endpoints.Auth;

public class ResetPasswordEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/reset-password", async (
    ResetPasswordRequest request,
    IMediator mediator,
    CancellationToken ct) =>
{
    var command = new ResetPasswordCommand(
        request.ResetToken,
        request.NewPassword
    );

    var result = await mediator.Send(command, ct);
    return Results.Ok(result);
})
.WithTags("Auth");
    }
}