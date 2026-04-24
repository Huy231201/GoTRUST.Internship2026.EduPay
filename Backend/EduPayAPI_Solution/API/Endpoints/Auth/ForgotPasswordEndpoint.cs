

public class ForgotPasswordEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/forgot-password", async (
            ForgotPasswordRequest request,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var command = new ForgotPasswordCommand(request.Email);

            var result = await mediator.Send(command, ct);

            return Results.Ok(result); 
        })
        .WithTags("Auth")
        .AllowAnonymous();
    }
}