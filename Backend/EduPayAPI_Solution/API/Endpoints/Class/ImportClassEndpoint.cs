
namespace EduPayAPI.API.Endpoints.Class;

public class ImportClassEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/classes/import", async (
            [FromForm] ImportClassRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Validate nhẹ
            if (request.File == null || request.File.Length == 0)
                return Results.BadRequest("File is required");

            if (request.BranchId == Guid.Empty)
                return Results.BadRequest("branchId is required");

            if (request.SchoolYearId == Guid.Empty)
                return Results.BadRequest("schoolYearId is required");

            var command = new ImportClassCommand(
                request.File,
                request.BranchId,
                request.SchoolYearId
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Classes")
        .DisableAntiforgery() // ⚠️ cần cho upload file
        .RequireAuthorization();
    }
}