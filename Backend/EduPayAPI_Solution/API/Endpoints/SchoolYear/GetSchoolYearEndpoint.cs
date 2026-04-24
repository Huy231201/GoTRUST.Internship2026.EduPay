


namespace EduPayAPI.API.Endpoints;

public class GetSchoolYearEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/edupay/v1/school-years", async (
            string? search,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var query = new GetSchoolYearQuery(search);

            var result = await mediator.Send(query, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("SchoolYear")
        .RequireAuthorization();
    }
}