namespace EduPayAPI.Application.Common.Interfaces;

// Interface định nghĩa các phương thức giao tiếp với các dịch vụ bên ngoài (Third-party API).
public interface IExternalApiService
{
    // Phương thức gửi yêu cầu GET đến một endpoint bên ngoài và trả về dữ liệu dạng chuỗi
    Task<string> GetDataAsync(
        string endpoint,
        CancellationToken cancellationToken);
}