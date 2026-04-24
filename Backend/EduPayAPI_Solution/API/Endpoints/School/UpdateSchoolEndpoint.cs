

namespace EduPayAPI.API.Endpoints.School;

public class UpdateMainSchoolEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("edupay/v1/schools/main", async (
            UpdateMainSchoolCommand command,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.Send(command, cancellationToken);
            return Results.Ok(result);
        })
        .WithTags("School")
        .RequireAuthorization();
    }
}