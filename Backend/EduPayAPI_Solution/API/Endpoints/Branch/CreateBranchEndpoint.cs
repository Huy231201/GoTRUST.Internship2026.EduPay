namespace EduPayAPI.API.Endpoints.Branch;

public class CreateBranchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/branches", async (
    CreateBranchRequest request,
    IMediator mediator,
    ISchoolRepository schoolRepo,
    CancellationToken cancellationToken) =>
{
    if (request.SchoolId == Guid.Empty)
        return Results.BadRequest(new { Message = "Invalid schoolId" });

    var isSchoolExist = await schoolRepo
        .ExistsByIdAsync(request.SchoolId, cancellationToken);

    if (!isSchoolExist)
        return Results.NotFound(new { Message = "Trường học không tồn tại!" });

    var command = new CreateBranchCommand(
        request.SchoolId,
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