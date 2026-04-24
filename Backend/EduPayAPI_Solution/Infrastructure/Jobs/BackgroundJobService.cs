namespace EduPayAPI.Infrastructure.Jobs;

public class BackgroundJobService : IBackgroundJobService 
{
    public void FireAndForgetJob()
    {
        // Tạo một công việc Fire-and-Forget
        BackgroundJob.Enqueue(() =>
            // Công việc sẽ ghi log thời gian thực thi
            Log.Information("Fire-and-forget job executed at {Time}", DateTime.UtcNow)
        );
    }

    public void DelayedJob()
    {
        // Tạo một công việc Delayed (trì hoãn 10 giây)
        BackgroundJob.Schedule(() =>
            Log.Information("Delayed job executed at {Time}", DateTime.UtcNow),
            TimeSpan.FromSeconds(10));
    }

    public void RecurringJob()
    {
        // Tạo một công việc Recurring (lặp lại hàng phút)
        Hangfire.RecurringJob.AddOrUpdate(
            "log-job",
            () => Log.Information("Recurring job executed at {Time}", DateTime.UtcNow),
            Cron.Minutely);
    }
}