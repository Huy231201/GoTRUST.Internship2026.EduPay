

using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using EduPayAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Serilog
Log.Logger = new LoggerConfiguration()
.WriteTo.Console()
.WriteTo.File(
    "/app/Logs/log-.txt",
    rollingInterval: RollingInterval.Day,
    retainedFileCountLimit: 1
)
// .WriteTo.MongoDB(
//     databaseUrl: builder.Configuration["MongoDb:ConnectionString"]!,
//     collectionName: "Logs"
// )
.CreateLogger();

builder.Host.UseSerilog();

// Đăng ký tầng 
builder.Services.AddApi(builder.Configuration);

builder.Services.AddControllers();

// Đăng ký tầng Application (MediatR + Handler)
builder.Services.AddApplication();

// Đăng ký tầng Infra (DbContext + Repository)
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.ConfigureReportingServices(config =>
{
    config.ConfigureWebDocumentViewer(viewer =>
    {
        viewer.UseCachedReportSourceBuilder();
    });
});

var app = builder.Build();

app.UseDevExpressControls();

//  Đăng ký Middleware xử lý lỗi toàn cục
app.UseMiddleware<ExceptionHandlingMiddleware>();

//  Bật Swagger UI
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EduPay API v1");
    });
// }

app.UseCors(EduPayAPI.API.DependencyInjection.CorsPolicyName);



app.UseAuthentication();
app.UseAuthorization();


// Cấu hình Hangfire Dashboard tại đường dẫn /hangfire
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    // Bảo vệ Dashboard bằng bộ lọc tùy chỉnh
    Authorization = new[] { new FreeAuthorizationFilter() }
});

app.UseRateLimiter();


// Map toàn bộ endpoint từ Carter
app.MapCarter();
app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();
}


app.Run();
