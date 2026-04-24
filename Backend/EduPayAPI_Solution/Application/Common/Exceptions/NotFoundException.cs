namespace EduPayAPI.Application.Common.Exceptions;

// Exception nghiệp vụ: không tìm thấy dữ liệu
public class NotFoundException : Exception
{
    public NotFoundException(string message)
        : base(message)
    {
    }
}
