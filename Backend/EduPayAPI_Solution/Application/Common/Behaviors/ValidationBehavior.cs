namespace EduPayAPI.Application.Common.Behaviors;

//
/// ValidationBehavior: Một "trạm kiểm soát" tự động nằm trong đường ống xử lý của MediatR.
/// Nó giúp tách biệt hoàn toàn việc kiểm tra dữ liệu ra khỏi Logic xử lý nghiệp vụ (Handler).
/// 
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    // 1. Chứa danh sách các quy tắc (Validator) tương ứng với Request đang gửi lên.
    // Ví dụ: Nếu gửi CreateCustomerCommand, nó sẽ tự tìm file CreateCustomerValidator.
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    // 2. Constructor: Nhờ Dependency Injection nạp tất cả các validator tìm được vào đây.
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    // 3. Hàm Handle: Đây là trái tim của "trạm kiểm soát".
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next, // 'next' là bước tiếp theo (Handler)
        CancellationToken cancellationToken)
    {
        // Bước A: Kiểm tra xem Request này có quy tắc kiểm tra (Validator) nào không?
        if (_validators.Any())
        {
            // Bước B: Tạo một "bối cảnh kiểm tra" dựa trên dữ liệu Request gửi lên
            var context = new ValidationContext<TRequest>(request);

            // Bước C: Chạy TẤT CẢ các file Validator cùng một lúc (bất đồng bộ) để tiết kiệm thời gian
            var validationResults = await Task.WhenAll(
                _validators.Select(v =>
                    v.ValidateAsync(context, cancellationToken))
            );

            // Bước D: Gom tất cả các lỗi vi phạm từ các Validator lại thành một danh sách
            var failures = validationResults
                .SelectMany(r => r.Errors)  // Lấy danh sách lỗi từ kết quả
                .Where(f => f != null)      // Loại bỏ các phần tử rỗng
                .ToList();

            // Bước E: Nếu phát hiện có ít nhất 1 lỗi vi phạm
            if (failures.Count != 0)
            {
                // NÉM RA NGOẠI LỆ (EXCEPTION)
                // Một khi đã ném lỗi ở đây, toàn bộ quá trình sẽ DỪNG LẠI.
                // Các bước phía sau (như lưu DB trong Handler) sẽ KHÔNG được chạy.
                throw new ValidationException(failures);
            }
        }

        // Bước F: Nếu dữ liệu sạch sẽ (không có lỗi) -> Cho phép đi tiếp đến Handler.
        // Lệnh 'await next()' tương đương với việc "mở cổng" cho Request đi vào trung tâm xử lý.
        return await next();
    }
}