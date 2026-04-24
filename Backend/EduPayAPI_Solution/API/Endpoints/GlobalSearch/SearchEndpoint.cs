
namespace EduPayAPI.API.Endpoints.GlobalSearch;

public class SearchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/global-search", async (
            Guid? schoolYearId,
            Guid? branchId,
            string? search,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var result = await mediator.Send(
                new SearchQuery(schoolYearId, branchId, search),
                ct
            );

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithTags("Global-Search");
    }
}