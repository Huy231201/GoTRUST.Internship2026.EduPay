
namespace EduPayAPI.API.Endpoints.Grade;

public class CreateGradeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/grades", async (
            CreateGradeRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return Results.BadRequest("Name is required");

            if (request.BranchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            if (request.SchoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Gọi handler
            var result = await mediator.Send(
                new CreateGradeCommand(
                    request.Name,
                    request.Description,
                    request.Status,
                    request.BranchId,
                    request.SchoolYearId
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Grades")
        .RequireAuthorization();
    }
}