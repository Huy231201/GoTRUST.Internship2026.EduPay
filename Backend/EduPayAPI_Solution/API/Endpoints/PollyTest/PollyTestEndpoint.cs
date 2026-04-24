

namespace EduPayAPI.API.Endpoints;

public class PollyTestModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("/api/test")
           .WithTags("Polly Test")
           .MapGet("/retry", async (
                IExternalApiService externalApiService,
                CancellationToken ct) =>
           {
               // Ép external API trả 500 để test Polly
               var result = await externalApiService.GetDataAsync("/status/500", ct);
               return Results.Ok(result);
           });
    }
}
