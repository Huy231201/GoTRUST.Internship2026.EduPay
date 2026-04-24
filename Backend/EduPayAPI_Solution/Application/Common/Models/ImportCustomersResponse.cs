namespace EduPayAPI.Application.Common.Models;


// Kết quả phản hồi sau khi import khách hàng
public class ImportCustomersResponse
{
    // Số lượng bản ghi thành công
    public int SuccessCount { get; set; }

    // Danh sách các lỗi phát sinh
    public List<ImportValidationError> Errors { get; set; } = new();
}