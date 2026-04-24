using EduPayAPI.Application.Features.Students.Delete;

namespace EduPayAPI.API.Endpoints.Student;

public class DeleteStudentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("edupay/v1/students/{id:guid}", async (
            Guid id,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            if (id == Guid.Empty)
                return Results.BadRequest("Invalid studentId");

            await mediator.Send(
                new DeleteStudentCommand(id),
                cancellationToken);

            return Results.Ok("Deleted successfully");
        })
        .WithTags("Students")
        .RequireAuthorization();
    }
}