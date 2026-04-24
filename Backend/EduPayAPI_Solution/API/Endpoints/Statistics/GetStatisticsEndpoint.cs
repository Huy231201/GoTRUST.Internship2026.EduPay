

namespace EduPayAPI.API.Endpoints.Statistics;

public class GetStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/statistics", async (
            Guid schoolId,
            Guid schoolYearId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Validate
            if (schoolId == Guid.Empty)
                return Results.BadRequest("Invalid schoolId");

            if (schoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Call handler
            var result = await mediator.Send(
                new GetStatisticsQuery(
                    schoolYearId,
                    schoolId
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Statistics")
        .RequireAuthorization();
    }
}