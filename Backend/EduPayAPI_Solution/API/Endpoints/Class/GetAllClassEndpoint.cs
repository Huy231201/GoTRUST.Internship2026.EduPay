

namespace EduPayAPI.API.Endpoints.Class;

public class GetAllClassEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/classes", async (
            Guid? schoolYearId,
            Guid? branchId,
            Guid? gradeId,
            string? search,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var query = new GetAllClassQuery(
                schoolYearId,
                branchId,
                gradeId,
                search
            );

            var result = await mediator.Send(query, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Classes")
        .RequireAuthorization();
    }
}