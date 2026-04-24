namespace EduPayAPI.Infrastructure.Jobs;

public class FreeAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        // Cho phép tất cả các yêu cầu truy cập dashboard
        return true;
    }
}
