using EduPayAPI.Application.Features.Teachers.Delete;

namespace EduPayAPI.API.Endpoints.Teacher;

public class DeleteTeacherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("edupay/v1/teachers/{id:guid}", async (
            Guid id,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
        
            if (id == Guid.Empty)
                return Results.BadRequest("Invalid id");

          
            await mediator.Send(
                new DeleteTeacherCommand(id),
                cancellationToken);

            return Results.Ok(); 
        })
        .WithTags("Teachers")
        .RequireAuthorization();
    }
}