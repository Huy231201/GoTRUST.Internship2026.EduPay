namespace EduPayAPI.API.DTOs.SchoolYear;

public class CreateSchoolYearRequest
{
    public string Name { get; set; } = default!; // tên năm học, ví dụ: "2023-2024"
    public DateOnly StartDate { get; set; } = default!;// ngày bắt đầu năm

    public DateOnly EndDate { get; set; } = default!; // ngày kết thúc năm học

    public string? Description { get; set; } // mô tả thêm về năm học
}