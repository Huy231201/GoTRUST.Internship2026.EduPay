

namespace EduPayAPI.API.Endpoints.Branch;

public class DeleteBranchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("edupay/v1/branches/{branchId:guid}", async (
            Guid branchId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // chỉ check basic
            if (branchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            await mediator.Send(
                new DeleteBranchCommand(branchId),
                cancellationToken);

            return Results.NoContent(); // 204
        })
        .WithTags("Branches")
        .RequireAuthorization();
    }
}