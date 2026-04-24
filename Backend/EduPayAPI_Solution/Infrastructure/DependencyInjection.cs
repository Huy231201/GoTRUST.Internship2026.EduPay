

namespace EduPayAPI.Infrastructure;

// File này dùng để đăng ký toàn bộ service của tầng Infrastructure
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Đăng ký DbContext cho EF Core
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")));

        // Đăng ký Repository
        // Khi App yêu cầu ICustomerRepository
        // thì cung cấp CustomerRepository
       

        // Đăng ký PasswordHasher
        services.AddScoped<IPasswordHasher, PasswordHasher>();


        // Đăng ký JwtTokenService
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        // Đăng ký UserRepository
        services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped<ISchoolRepository, SchoolRepository>();

        services.AddScoped<IBranchRepository, BranchRepository>();

        services.AddScoped<ISchoolYearRepository, SchoolYearRepository>();

        services.AddScoped<IGradeRepository, GradeRepository>();

        services.AddScoped<IClassRepository, ClassRepository>();

        services.AddScoped<IStudentRepository, StudentRepository>();

        
        services.AddScoped<ITeacherRepository, TeacherRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IClassImportService, ClassExcelImportService>();
        services.AddScoped<IClassImportService, ClassCsvImportService>();

        services.AddScoped<IStudentImportService, StudentExcelImportService>();

        services.AddScoped<IStudentImportService, StudentCsvImportService>();

        services.AddScoped<StudentImportFactory>();
        
        services.AddScoped<ClassImportFactory>();

        services.AddScoped<IStatisticsRepository, StatisticsRepository>();

        services.AddScoped<IOtpRepository, OtpRepository>();

        services.AddScoped<IEmailService, EmailService>();

        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        services.AddDevExpressControls();
        
        services.AddScoped<IReportProvider, CustomReportProvider>();

        // Đăng ký MemoryCache
        // services.AddMemoryCache();

        // Đăng ký CacheService
        services.AddScoped<ICacheService, RedisCacheService>();

        // Đăng ký Redis
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "EduPay_";
        });


        // Đăng ký ExternalApiService với HttpClient kèm chính sách Retry và Circuit Breaker
        services.AddHttpClient<IExternalApiService, ExternalApiService>(client =>
        {
            // Thiết lập địa chỉ cơ sở từ cấu hình
            client.BaseAddress = new Uri(configuration["ExternalApi:BaseUrl"]!);
        })
        .AddPolicyHandler(GetRetryPolicy())
        .AddPolicyHandler(GetCircuitBreakerPolicy());

        var hangfireConnectionString = configuration["Hangfire:ConnectionString"];

        services.AddHangfire(config =>
        {
            config.UsePostgreSqlStorage(
                bootstrapper =>
                {
                    bootstrapper.UseNpgsqlConnection(hangfireConnectionString);
                },
                new PostgreSqlStorageOptions
                {
                    SchemaName = "hangfire"
                });
        });



        // Đăng ký Hangfire Server
        services.AddHangfireServer();
        
        // Đăng ký BackgroundJobService
        services.AddScoped<IBackgroundJobService, BackgroundJobService>();



        return services;
    }

    // Chính sách Retry: Thử lại khi gặp lỗi tạm thời (5xx, timeout, network failure)
    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
    {
        return HttpPolicyExtensions
        .HandleTransientHttpError() // Bắt các lỗi HTTP 5xx, 408 
        .WaitAndRetryAsync(
            retryCount: 2, // Thử lại 3 lần
            
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) // Giúp giãn cách giữa các lần thử lại
            ,

            // Hành động khi retry
            onRetry: (outcome, timespan, retryCount, context) =>
            {
                // Ghi log thông tin về lần retry
                Log.Warning("Retry {RetryCount} after {Delay}s due to: {Reason}",
                    retryCount,
                    timespan.TotalSeconds,
                    outcome.Exception?.Message ?? outcome.Result.StatusCode.ToString()
                );
            }
        );
    }


    // Chính sách Circuit Breaker: Ngắt kết nối khi có quá nhiều lỗi liên tiếp
    private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError() // Bắt các lỗi HTTP 5xx, 408
            .CircuitBreakerAsync(
                handledEventsAllowedBeforeBreaking: 3, // Ngắt sau 5 lỗi liên tiếp
                durationOfBreak: TimeSpan.FromSeconds(30), // Ngắt trong 30 giây

                // Hành động khi circuit bị ngắt
                onBreak: (outcome, breakDelay) =>
                {
                    Log.Error("Circuit broken for {Delay}s", breakDelay.TotalSeconds);
                },

                // Hành động khi circuit được reset
                onReset: () =>
                {
                    Log.Information("Circuit reset");
                });
    }
}