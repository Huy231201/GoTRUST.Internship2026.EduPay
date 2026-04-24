

namespace EduPayAPI.API.Endpoints.Report;

public class GetStudentReportEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/reports/students", async (
            [AsParameters] StudentReportRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // 🔥 Map Request → Query
            var query = new GetStudentReportQuery(
                request.BranchId,
                request.SchoolYearId,
                request.GradeId,
                request.ClassId,
                request.Status
            );

            // 🔥 Call handler
            var result = await mediator.Send(query, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization();
    }
}