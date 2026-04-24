

namespace EduPayAPI.Application.Features.SchoolYear;

public class CreateSchoolYearEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/school-years", async (
            CreateSchoolYearCommand request, 
            IMediator mediator, 
            CancellationToken cancellationToken) =>
        {
            var command = new CreateSchoolYearCommand(
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

