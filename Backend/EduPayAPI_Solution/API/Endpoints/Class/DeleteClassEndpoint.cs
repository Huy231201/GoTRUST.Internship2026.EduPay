

namespace EduPayAPI.API.Endpoints.Class;

public class DeleteClassEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("edupay/v1/classes/{classId:guid}", async (
            Guid classId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            if (classId == Guid.Empty)
                return Results.BadRequest("Invalid classId");

            await mediator.Send(
                new DeleteClassCommand(classId),
                cancellationToken);

            return Results.Ok();
        })
        .WithTags("Classes")
        .RequireAuthorization();
    }
}
