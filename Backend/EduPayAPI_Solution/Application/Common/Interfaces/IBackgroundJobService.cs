namespace EduPayAPI.Application.Common.Interfaces;

public interface IBackgroundJobService
{
    void FireAndForgetJob();
    void DelayedJob();
    void RecurringJob();
}
