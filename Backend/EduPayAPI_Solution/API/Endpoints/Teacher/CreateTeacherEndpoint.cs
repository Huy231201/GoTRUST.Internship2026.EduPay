

using EduPayAPI.API.DTOs.Teacher;
using EduPayAPI.Application.Features.Teachers.Create;

namespace EduPayAPI.API.Endpoints.Teacher;

public class CreateTeacherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/teachers", async (
            CreateTeacherRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Validate
            if (string.IsNullOrWhiteSpace(request.Code))
                return Results.BadRequest("Code is required");

            if (string.IsNullOrWhiteSpace(request.Name))
                return Results.BadRequest("Name is required");

            if (string.IsNullOrWhiteSpace(request.Email))
                return Results.BadRequest("Email is required");

            if (request.BranchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            if (request.SchoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Gọi handler
            var result = await mediator.Send(
                new CreateTeacherCommand(
                    request.Code,
                    request.Name,
                    request.Email,
                    request.PhoneNumber,
                    request.BranchId,
                    request.SchoolYearId
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Teachers")
        .RequireAuthorization();
    }
}