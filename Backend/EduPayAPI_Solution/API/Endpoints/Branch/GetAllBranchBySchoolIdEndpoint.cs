

namespace EduPayAPI.API.Endpoints.Branch;

public class GetAllBranchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/branches/by-school/{schoolId:guid}", async (
            Guid schoolId,
            IMediator mediator,
            ISchoolRepository schoolRepository,
            CancellationToken cancellationToken) =>
        {
            // ❗ Guid.Empty => BadRequest (không phải NotFound)
            if (schoolId == Guid.Empty)
                return Results.BadRequest("Invalid schoolId");

            // 🔥 Check school tồn tại
            var isExist = await schoolRepository
                .ExistsByIdAsync(schoolId, cancellationToken);

            if (!isExist)
                throw new NotFoundException("School not found");

            // 🔥 Lấy branch
            var result = await mediator.Send(
                new GetAllBranchQuery(schoolId),
                cancellationToken);

            return Results.Ok(result); // [] vẫn OK
        })
        .WithTags("Branches")
        .RequireAuthorization();
    }
}