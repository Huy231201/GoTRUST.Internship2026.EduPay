

namespace EduPayAPI.API.Endpoints.SchoolYear;

public class GetSchoolYearByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/school-year/{schoolYearId:guid}", async (
            Guid schoolYearId,
            IMediator mediator,
            ISchoolYearRepository schoolYearRepository,
            CancellationToken cancellationToken) =>
        {
            // ❗ Check Guid rỗng
            if (schoolYearId == Guid.Empty)
                return Results.BadRequest("Invalid schoolYearId");

            // 🔥 Check tồn tại
            var isExist = await schoolYearRepository
                .GetByIdAsync(schoolYearId, cancellationToken);

            if (isExist == null)
                throw new NotFoundException("SchoolYear not found");

            // 🔥 Gọi handler
            var result = await mediator.Send(
                new GetSchoolYearByIdQuery(schoolYearId),
                cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("SchoolYear")
        .RequireAuthorization();
    }
}