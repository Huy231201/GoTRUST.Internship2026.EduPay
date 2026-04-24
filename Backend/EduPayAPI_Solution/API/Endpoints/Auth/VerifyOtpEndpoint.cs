

namespace EduPayAPI.Endpoints.Auth;
public class VerifyOtpEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/verify-otp", async (
            VerifyOtpCommand command,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var result = await mediator.Send(command, ct);
            return Results.Ok(result);
        })
        .WithTags("Auth");
    }
}