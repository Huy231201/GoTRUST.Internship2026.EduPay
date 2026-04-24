
namespace EduPayAPI.Infrastructure.ImportClassService;

public class ClassCsvImportService : IClassImportService
{
    public List<string> SupportedExtensions => new() { ".csv" };

    public async Task<List<ImportClassDto>> ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct)
    {
        var result = new List<ImportClassDto>();

        using var reader = new StreamReader(file.OpenReadStream());

        int row = 0;

        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            row++;

            if (row == 1) continue;

            var cols = line.Split(',');

            if (cols.Length < 3) continue;

            var dto = new ImportClassDto
            {
                Name = cols[0].Trim(),
                Code = cols[1].Trim(),
                GradeName = cols[2].Trim()
            };

            result.Add(dto);
        }

        return result;
    }
}