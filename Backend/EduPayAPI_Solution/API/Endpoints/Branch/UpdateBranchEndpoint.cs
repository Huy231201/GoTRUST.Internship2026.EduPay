


namespace EduPayAPI.API.Endpoints.Branch;

public class UpdateBranchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("edupay/v1/branches/{branchId:guid}", async (
            Guid branchId,
            UpdateBranchRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            // 🔥 check basic
            if (branchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            // 🔥 map Request → Command
            var command = new UpdateBranchCommand(
                branchId,
                request.Name,
                request.Code,
                request.Address,
                request.Level,
                request.TaxCode,
                request.Email,
                request.Phone,
                request.Type
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Branches")
        .RequireAuthorization();
    }
}