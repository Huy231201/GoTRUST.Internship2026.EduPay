using EduPayAPI.Application.Features.Teachers.Update;

namespace EduPayAPI.API.Endpoints.Teacher;

public class UpdateTeacherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("edupay/v1/teachers/{id:guid}", async (
            Guid id,
            UpdateTeacherRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // ❗ Validate
            if (id == Guid.Empty)
                return Results.BadRequest("Invalid id");

            var result = await mediator.Send(
                new UpdateTeacherCommand(
                    id,
                    request.Code,
                    request.Name,
                    request.Email,
                    request.PhoneNumber,
                    request.Status
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Teachers")
        .RequireAuthorization();
    }
}