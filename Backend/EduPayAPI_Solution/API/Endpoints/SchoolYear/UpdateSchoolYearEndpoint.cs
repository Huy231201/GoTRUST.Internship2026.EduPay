
using EduPayAPI.API.DTOs.SchoolYear;

namespace EduPayAPI.API.Endpoints.SchoolYear;

public class UpdateSchoolYearEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/edupay/v1/school-years/{id}", async (
            Guid id,
            UpdateSchoolYearRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateSchoolYearCommand(
                id,
                request.Name,
                request.StartDate,
                request.EndDate,
                request.Description
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("SchoolYear")
        .RequireAuthorization();
    }
}