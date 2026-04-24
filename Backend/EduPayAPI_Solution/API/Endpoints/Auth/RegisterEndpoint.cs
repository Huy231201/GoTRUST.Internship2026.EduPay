

namespace EduPayAPI.API.Endpoints.Auth;

public class RegisterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("edupay/v1/auth/register", async (
            RegisterRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new RegisterCommand(
                // User
                request.Account,
                request.Password,
                request.FullName,

                new SchoolCommand(

                // School (required)
                request.School.Name,
                request.School.Code,
                request.School.Level,
                request.School.TaxCode,

                //  School (optional)
                request.School.Email,
                request.School.Phone,
                request.School.Website,
                request.School.Principal,
                request.School.Address,
                request.School.Type
                )
            );

            var result = await mediator.Send(command, cancellationToken);

            return Results.Ok(result);
        })
        .WithTags("Auth");
    }
}