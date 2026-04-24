namespace EduPayAPI.Infrastructure.ExternalApis;

public class ExternalApiService: IExternalApiService
{
    private readonly HttpClient _httpClient;

    public ExternalApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetDataAsync(string endpoint, CancellationToken cancellationToken)
    {
        // Gửi yêu cầu GET đến endpoint bên ngoài
        var response = await _httpClient.GetAsync(endpoint, cancellationToken);

        // Đảm bảo phản hồi thành công
        response.EnsureSuccessStatusCode();

        // Đọc và trả về nội dung phản hồi dưới dạng chuỗi
        return await response.Content.ReadAsStringAsync(cancellationToken);
    }
}