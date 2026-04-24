namespace EduPayAPI.Infrastructure.ImportClassService;

public class ClassExcelImportService : IClassImportService
{
    public List<string> SupportedExtensions => new() { ".xlsx" };

    public async Task<List<ImportClassDto>> ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct)
    {
        var result = new List<ImportClassDto>();

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, ct);

        using var workbook = new XLWorkbook(stream);
        var sheet = workbook.Worksheets.First();

        var range = sheet.RangeUsed();
        
        if (range == null)
        {
            return result;
        }

        var rows = range.RowsUsed().Skip(1);

        foreach (var row in rows)
        {
            var name = row.Cell(1).GetString().Trim();
            var code = row.Cell(2).GetString().Trim();
            var gradeName = row.Cell(3).GetString().Trim();

            if (string.IsNullOrEmpty(name)) continue;

            var dto = new ImportClassDto
            {
                Name = name,
                Code = code,
                GradeName = gradeName
            };

            result.Add(dto);
        }

        return result;
    }
}