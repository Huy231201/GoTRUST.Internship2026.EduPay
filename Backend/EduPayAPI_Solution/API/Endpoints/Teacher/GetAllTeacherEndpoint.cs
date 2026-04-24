using EduPayAPI.Application.Features.Teachers.GetAll;
using EduPayAPI.Domain.Enums;

namespace EduPayAPI.API.Endpoints.Teacher;

public class GetAllTeacherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/teachers", async (
            Guid? branchId,
            Guid? schoolYearId,
            string? search,
            TeacherStatus? status,
            Guid? departmentId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.Send(
                new GetAllTeacherQuery(
                    branchId,
                    schoolYearId,
                    search,
                    status,
                    departmentId
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Teachers")
        .RequireAuthorization();
    }
}