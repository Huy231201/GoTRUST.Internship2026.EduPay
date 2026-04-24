


namespace EduPayAPI.API.Endpoints.Students;

public class ImportStudentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/students/import", async (
            [FromForm] ImportStudentRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            if (request.File == null || request.File.Length == 0)
                return Results.BadRequest("File is required");

            if (request.BranchId == Guid.Empty)
                return Results.BadRequest("branchId is required");

            if (request.SchoolYearId == Guid.Empty)
                return Results.BadRequest("schoolYearId is required");

            var command = new ImportStudentCommand(
                request.File,
                request.BranchId,
                request.SchoolYearId
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Students")
        .DisableAntiforgery()
        .RequireAuthorization();
    }
}