

namespace EduPayAPI.API.Endpoints.Student;

public class CreateStudentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/students", async (
            CreateStudentRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Validate
            if (string.IsNullOrWhiteSpace(request.Code))
                return Results.BadRequest("Code is required");

            if (string.IsNullOrWhiteSpace(request.FullName))
                return Results.BadRequest("FullName is required");

            if (request.ClassId == Guid.Empty)
                return Results.BadRequest("Invalid classId");

            if (request.BranchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            if (request.SchoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Gọi handler
            var result = await mediator.Send(
                new CreateStudentCommand(
                    request.Code,
                    request.FullName,
                    request.Gender,
                    request.DateOfBirth,
                    request.ClassId,
                    request.Type,
                    request.BranchId,
                    request.SchoolYearId,
                    request.Email,
                    request.PhoneNumber
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Students")
        .RequireAuthorization();
    }
}