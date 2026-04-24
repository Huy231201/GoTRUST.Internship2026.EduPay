

namespace EduPayAPI.API.Middlewares;

// Middleware này đóng vai trò là "Lưới hứng lỗi" toàn cục cho cả hệ thống.
// Nó đứng ngoài cùng để bắt mọi Exception bắn ra từ Validation, Handler hay Database.
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next; // Đại diện cho trạm tiếp theo trong đường ống
    private readonly ILogger<ExceptionHandlingMiddleware> _logger; // Công cụ ghi nhật ký lỗi

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Cho phép yêu cầu (request) đi tiếp vào các tầng bên trong
            await _next(context);
        }
        catch (Exception ex)
        {
            // Nếu có BẤT KỲ lỗi nào xảy ra ở tầng trong, nó sẽ văng ra đây
            // Ghi log lỗi chi tiết kèm StackTrace để Developer kiểm tra
            _logger.LogError(ex, "Phát hiện lỗi chưa được xử lý: {Message}", ex.Message);

            // Chuyển lỗi sang hàm định dạng lại dữ liệu trả về cho Client
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        context.Response.ContentType = "application/json";

        // MẶC ĐỊNH: Coi như đây là lỗi hệ thống (500) nếu không khớp các điều kiện dưới
        var statusCode = StatusCodes.Status500InternalServerError;

        // Khởi tạo khuôn mẫu phản hồi theo chuẩn quốc tế RFC 7231
        var response = new Dictionary<string, object?>
        {
            ["type"] = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            ["title"] = "Internal Server Error", // Thông báo chung cho lỗi 500
            ["status"] = statusCode,
            ["traceId"] = context.TraceIdentifier // Mã số định danh để đối chiếu với Log
        };

        // -------------------------------------------------------------------
        // TRƯỜNG HỢP: Lỗi Validation (Do người dùng nhập sai - Mã 400)
        // -------------------------------------------------------------------
        if (exception is ValidationException validationEx)
        {
            statusCode = StatusCodes.Status400BadRequest;

            response["type"] = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
            response["title"] = "One or more validation errors occurred.";
            response["status"] = statusCode;

            // Gom nhóm lỗi theo từng trường (Field) để Frontend dễ hiển thị
            response["errors"] = validationEx.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );
        }
        // -------------------------------------------------------------------
        // TRƯỜNG HỢP: Lỗi NotFound (Tìm không thấy dữ liệu - Mã 404)
        // -------------------------------------------------------------------
        else if (exception is NotFoundException)
        {
            statusCode = StatusCodes.Status404NotFound;

            response["type"] = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
            response["title"] = exception.Message; // Lấy thông báo lỗi cụ thể từ Exception
            response["status"] = statusCode;
        }

        else if (exception is UnauthorizedException)
        {
            statusCode = StatusCodes.Status401Unauthorized;

            response["type"] = "https://tools.ietf.org/html/rfc7235#section-6.5.3";
            response["title"] = exception.Message; // Lấy thông báo lỗi cụ thể từ Exception
            response["status"] = statusCode;
        }

        else if (exception is ConflictException)
        {
            statusCode = StatusCodes.Status409Conflict;

            response["type"] = "https://tools.ietf.org/html/rfc7231#section-6.5.8";
            response["title"] = exception.Message; // Lấy thông báo lỗi cụ thể từ Exception
            response["status"] = statusCode;
        }

        else if (exception is ImportValidationException importEx)
        {
            statusCode = StatusCodes.Status400BadRequest;

            response["type"] = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
            response["title"] = exception.Message;
            response["status"] = statusCode;
            response["errors"] = importEx.Errors;
        }

        else if (exception is BadRequestException)
        {
            statusCode = StatusCodes.Status400BadRequest;

            response["type"] = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
            response["title"] = exception.Message; 
            response["status"] = statusCode;
        }

        // Bước cuối: Thiết lập StatusCode và trả về JSON cho Client
        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsJsonAsync(response);
    }

}