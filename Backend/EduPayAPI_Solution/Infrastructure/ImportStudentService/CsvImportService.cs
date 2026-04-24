namespace EduPayAPI.Infrastructure.ImportStudentService;

public class StudentCsvImportService : IStudentImportService
{
    public List<string> SupportedExtensions => new() { ".csv" };

    public async Task<List<ImportStudentDto>> ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct)
    {
        var result = new List<ImportStudentDto>();

        using var reader = new StreamReader(file.OpenReadStream());

        int row = 0;

        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            row++;

            if (row == 1) continue;

            var cols = line.Split(',');

            if (cols.Length < 8) continue;

            result.Add(new ImportStudentDto
            {
                Code = cols[0].Trim(),
                FullName = cols[1].Trim(),
                Email = cols[2].Trim(),
                PhoneNumber = cols[3].Trim(),
                Gender = cols[4].Trim(),
                DateOfBirth = cols[5].Trim(),
                ClassName = cols[6].Trim(),
                Type = cols[7].Trim()
            });
        }

        return result;
    }
}