

namespace EduPayAPI.API.Endpoints.SchoolYear;

public class DeleteSchoolYearEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/edupay/v1/school-years/{id}", async (
            Guid id,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new DeleteSchoolYearCommand(id);

            await mediator.Send(command, cancellationToken);

            return Results.NoContent();
        })
        .WithTags("SchoolYear")
        .RequireAuthorization();
    }
}