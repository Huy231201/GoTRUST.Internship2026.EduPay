

namespace EduPayAPI.API.Endpoints.Student;

public class UpdateStudentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("edupay/v1/students/{id:guid}", async (
            Guid id,
            UpdateStudentRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            if (id == Guid.Empty)
                return Results.BadRequest("Invalid studentId");

            if (string.IsNullOrWhiteSpace(request.FullName))
                return Results.BadRequest("FullName is required");

            if (request.ClassId == Guid.Empty)
                return Results.BadRequest("Invalid classId");

            var result = await mediator.Send(
                new UpdateStudentCommand(
                    id,
                    request.FullName,
                    request.Code,
                    request.Gender,
                    request.DateOfBirth,
                    request.ClassId,
                    request.Type,
                    request.Email,
                    request.PhoneNumber,
                    request.Status
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Students")
        .RequireAuthorization();
    }
}