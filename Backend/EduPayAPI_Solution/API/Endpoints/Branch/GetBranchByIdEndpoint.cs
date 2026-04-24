

namespace EduPayAPI.API.Endpoints.Branch;

public class GetBranchByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/branches/{branchId:guid}", async (
            Guid branchId,
            IMediator mediator,
            IBranchRepository branchRepository,
            CancellationToken cancellationToken) =>
        {
            // ❗ Check Guid rỗng
            if (branchId == Guid.Empty)
                return Results.BadRequest("Invalid branchId");

            // 🔥 Check branch tồn tại
            var isExist = await branchRepository
                .GetByIdAsync(branchId, cancellationToken);

            if (isExist == null)
                throw new NotFoundException("Branch not found");

            // 🔥 Gọi handler
            var result = await mediator.Send(
                new GetBranchByIdQuery(branchId),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Branches")
        .RequireAuthorization();
    }
}