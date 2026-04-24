

namespace EduPayAPI.API.Endpoints.Grade;

public class DeleteGradeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("edupay/v1/grades/{gradeId:guid}", async (
            Guid gradeId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Check basic
            if (gradeId == Guid.Empty)
                return Results.BadRequest("Invalid gradeId");

            // 🔥 Gọi handler
            await mediator.Send(
                new DeleteGradeCommand(gradeId),
                cancellationToken);

            return Results.Ok();
        })
        .WithTags("Grades")
        .RequireAuthorization();
    }
}