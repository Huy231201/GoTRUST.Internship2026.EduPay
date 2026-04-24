

namespace EduPayAPI.API.Endpoints.Grade;

public class GetAllGradeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/grades", async (
            string? search,
            bool? status,
            Guid? branchId,
            Guid? schoolYearId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            
            if (branchId.HasValue && branchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            if (schoolYearId.HasValue && schoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Gọi Query
            var result = await mediator.Send(
                new GetAllGradeQuery(
                    search,
                    status,
                    branchId,
                    schoolYearId
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Grades")
        .RequireAuthorization();
    }
}