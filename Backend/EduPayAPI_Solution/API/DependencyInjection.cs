
namespace EduPayAPI.API;

public static class DependencyInjection
{
    // Đây là "Tên định danh" (Key) để hệ thống biết chính sách CORS nào được áp dụng
    private const string AllowFrontEndPolicy = "AllowFrontEnd";

    public static IServiceCollection AddApi(
        this IServiceCollection services,
        IConfiguration configuration)
    {

        // Carter: Thư viện hỗ trợ quản lý các Endpoint (Minimal APIs) một cách gọn gàng theo module
        services.AddCarter();

    //     services.ConfigureHttpJsonOptions(options =>
    // {
    //     options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    // });

        // // Đăng ký dịch vụ Cache trong bộ nhớ (In-Memory Cache)
        // services.AddMemoryCache();

        // Cấu hình CORS (Cross-Origin Resource Sharing)
        services.AddCors(options =>
        {
            options.AddPolicy(AllowFrontEndPolicy, builder =>
            {
                builder
                // Danh sách trắng các địa chỉ (Origins) được phép truy cập vào API
                .WithOrigins(
                    "http://localhost:3000", // Cổng mặc định của React
                    "http://localhost:5173",  // Cổng mặc định của Vite
                    "http://localhost:5000", 
                    "http://localhost:8080"
                )
                .AllowAnyHeader()  // Cho phép mọi loại Header (Authorization, Content-Type, v.v.)
                .AllowAnyMethod()  // Cho phép mọi phương thức (GET, POST, PUT, DELETE,...)
                .AllowCredentials(); // Cho phép gửi kèm Cookie hoặc thông tin xác thực
            });
        });

        // Cấu hình Swagger (Giao diện tài liệu API và Test)
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "EduPay API"
            });

            // 1. Định nghĩa chuẩn bảo mật JWT cho Swagger UI
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization", // Tên Header sẽ chứa Token
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer", // Chuẩn xác thực Bearer
                BearerFormat = "JWT",
                In = ParameterLocation.Header, // Token nằm trong Header của Request
                Description = "Enter in the format: Bearer {your_jwt_token}"
            });

            // 2. Áp dụng quy định bảo mật này cho tất cả các API hiển thị trên Swagger
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer" // Phải khớp với Id đã định nghĩa ở AddSecurityDefinition
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });


        // Đăng ký dịch vụ Rate Limiter (Giới hạn lượt truy cập) vào hệ thống
        services.AddRateLimiter(options =>
        {
            // Cấu hình sự kiện xảy ra khi người dùng vượt quá giới hạn (Bị chặn)
            options.OnRejected = async (context, cancellationToken) =>
            {
                // Thiết lập mã lỗi HTTP 429 (Too Many Requests)
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

                // Trả về một đối tượng JSON chi tiết để Client/Front-end biết lý do bị lỗi
                await context.HttpContext.Response.WriteAsJsonAsync(new
                {
                    // Link dẫn đến tiêu chuẩn quốc tế về lỗi này
                    type = "https://tools.ietf.org/html/rfc6585#section-4",
                    title = "Too many requests",
                    status = 429,
                    // Mã định danh yêu cầu (Cực kỳ quan trọng để tra cứu Log khi cần)
                    traceId = context.HttpContext.TraceIdentifier
                }, cancellationToken);
            };

            // Tạo một bộ lọc giới hạn toàn cục (áp dụng cho mọi API)
            // Cách lọc: Chia nhóm dựa trên địa chỉ IP (Partitioned by IP)
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
                httpContext =>
                    // Sử dụng thuật toán Fixed Window (Cửa sổ thời gian cố định)
                    RateLimitPartition.GetFixedWindowLimiter(
                        // Mỗi IP khác nhau sẽ có một "hũ" lượt gọi riêng (không dùng chung với nhau)
                        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        
                        // Cấu hình thông số giới hạn cho mỗi IP
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 100,              // Tối đa 100 yêu cầu
                            Window = TimeSpan.FromMinutes(1), // Trong vòng mỗi 1 phút
                            QueueLimit = 0                  // Nếu quá 100, từ chối luôn, không cho xếp hàng chờ
                        }));
        });

        services.AddAuthentication(configuration);
        
        // Đăng ký dịch vụ Phân quyền (Authorization)
        services.AddAuthorization();
        
        return services;
    }

    private static IServiceCollection AddAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Lấy các thông số cấu hình JWT từ file appsettings.json
        var jwt = configuration.GetSection("Jwt");

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Cấu hình các quy tắc để kiểm tra tính hợp lệ của Token
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,   // Kiểm tra bên phát hành Token
                    ValidateAudience = true, // Kiểm tra bên sử dụng Token
                    ValidateLifetime = true, // Kiểm tra Token còn hạn hay không
                    ValidateIssuerSigningKey = true, // Kiểm tra chữ ký bảo mật

                    ValidIssuer = jwt["Issuer"],
                    ValidAudience = jwt["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwt["SecretKey"]!)
                    ),

                    // ClockSkew = Zero giúp Token hết hạn chính xác từng giây theo cấu hình
                    ClockSkew = TimeSpan.Zero
                };

                // Tùy chỉnh các sự kiện xảy ra trong quá trình xác thực
                options.Events = new JwtBearerEvents
                {
                    // Xử lý khi xác thực thất bại (Ví dụ: Không có Token hoặc Token sai)
                    OnChallenge = context =>
                    {
                        // Ngăn chặn phản hồi mặc định của hệ thống
                        context.HandleResponse();
                        
                        // Trả về mã lỗi 401 Unauthorized
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";

                        // Trả về một JSON Object mô tả lỗi 
                        return context.Response.WriteAsJsonAsync(new
                        {
                            type = "https://tools.ietf.org/html/rfc7235#section-6.5.3",
                            title = "Unauthorized",
                            status = StatusCodes.Status401Unauthorized,
                            detail = "You need to provide valid access token to access this resource."
                        });
                    }
                };
            });

        return services;
    }

    // Biến static để file Program.cs có thể gọi tên chính sách CORS mà không sợ gõ sai tên
    public static string CorsPolicyName => AllowFrontEndPolicy;
}