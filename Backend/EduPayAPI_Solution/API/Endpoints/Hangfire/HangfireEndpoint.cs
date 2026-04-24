
namespace EduPayAPI.API.Endpoints;

public class HangfireModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {


        var group = app.MapGroup("/api/hangfire")
                       .WithTags("Hangfire");

        // Endpoint để tạo một công việc Fire-and-Forget
        group.MapPost("/fire", (IBackgroundJobService jobService) =>
        {
            jobService.FireAndForgetJob();
            return Results.Ok("Fire-and-forget job queued");
        });

        // Endpoint để tạo một công việc Delayed
        group.MapPost("/delay", (IBackgroundJobService jobService) =>
        {
            jobService.DelayedJob();
            return Results.Ok("Delayed job queued (10s)");
        });

        // Endpoint để tạo một công việc Recurring
        group.MapPost("/recurring", (IBackgroundJobService jobService) =>
        {
            jobService.RecurringJob();
            return Results.Ok("Recurring job registered (every minute)");
        });
    }
}
