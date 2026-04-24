

namespace EduPayAPI.API.Endpoints.Grade;

public class UpdateGradeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("edupay/v1/grades/{gradeId:guid}", async (
            Guid gradeId,
            UpdateGradeRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Check basic
            if (gradeId == Guid.Empty)
                return Results.BadRequest("Invalid gradeId");

            if (string.IsNullOrWhiteSpace(request.Name))
                return Results.BadRequest("Name is required");

            // 🔥 Map Request → Command
            var command = new UpdateGradeCommand(
                gradeId,
                request.Name,
                request.Description,
                request.Status
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Grades")
        .RequireAuthorization();
    }
}