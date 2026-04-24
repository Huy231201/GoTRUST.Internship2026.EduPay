

namespace EduPayAPI.API.Endpoints.Class;

public class BulkCreateClassEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/classes/bulk-create", async (
            BulkCreateClassCommand request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // 1. Gọi handler
            var result = await mediator.Send(request, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Classes")
        .RequireAuthorization();
    }
}