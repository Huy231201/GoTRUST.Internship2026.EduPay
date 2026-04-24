namespace EduPayAPI.Infrastructure.ImportStudentService;

public class StudentExcelImportService : IStudentImportService
{
    public List<string> SupportedExtensions => new() { ".xlsx" };

    public async Task<List<ImportStudentDto>> ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct)
    {
        var result = new List<ImportStudentDto>();

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
            var dobCell = row.Cell(6);

            string dobString;

            if (dobCell.DataType == XLDataType.DateTime)
            {
                dobString = dobCell.GetDateTime().ToString("yyyy-MM-dd");
            }
            else
            {
                dobString = dobCell.GetString().Trim();
            }

            var dto = new ImportStudentDto
            {
                Code = row.Cell(1).GetString().Trim(),
                FullName = row.Cell(2).GetString().Trim(),
                Email = row.Cell(3).GetString().Trim(),
                PhoneNumber = row.Cell(4).GetString().Trim(),
                Gender = row.Cell(5).GetString().Trim(),
                DateOfBirth = dobString,
                ClassName = row.Cell(7).GetString().Trim(),
                Type = row.Cell(8).GetString().Trim()
            };

            result.Add(dto);
        }

        return result;
    }
}