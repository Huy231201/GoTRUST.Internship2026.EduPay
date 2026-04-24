namespace EduPayAPI.Application.Common.Models;

public class CustomerImportModel
{
    // Lưu số thứ tự của dòng trong file Excel/CSV gốc
    // Dùng để báo lỗi chính xác vị trí cho người dùng nếu dữ liệu dòng đó bị sai.
    public int Row {get; set;}
    public string FullName {get; set;} = default!;
    public string Email { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
}