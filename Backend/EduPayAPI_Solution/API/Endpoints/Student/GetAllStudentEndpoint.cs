

namespace EduPayAPI.API.Endpoints.Student;

public class GetStudentsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/students", async (
            string? search,
            StudentStatus? status,
            Guid? classId,
            Guid? branchId,
            Guid? schoolYearId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.Send(
                new GetStudentsQuery(
                    schoolYearId,
                    branchId,
                    classId,
                    status,
                    search
                ),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Students")
        .RequireAuthorization();
    }
}