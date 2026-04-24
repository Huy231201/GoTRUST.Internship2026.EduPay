
namespace EduPayAPI.API.Endpoints.School;

public class GetMainSchoolEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/schools/main", async (IMediator mediator, CancellationToken cancellationToken) =>
        {
            var result = await mediator.Send(new GetMainSchoolQuery(), cancellationToken);
            return Results.Ok(result);
        })
        .WithTags("School")
        .RequireAuthorization();
    }
}