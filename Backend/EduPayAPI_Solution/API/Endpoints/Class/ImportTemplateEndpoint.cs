

namespace EduPayAPI.API.Endpoints.Classes;

public class DownloadClassTemplateEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/classes/import-template", async (
            Guid branchId,
            Guid schoolYearId,
            IGradeRepository gradeRepository,
            CancellationToken ct) =>
        {
            // 1. lấy danh sách khối
            var grades = await gradeRepository.GetByBranchAndYearAsync(
                branchId,
                schoolYearId,
                ct);

            if (!grades.Any())
            {
                return Results.BadRequest("There is no grade in this branch and schoolYear");
            }

            using var workbook = new XLWorkbook();

            // 🔥 Sheet chính để nhập dữ liệu
            var sheet = workbook.Worksheets.Add("Template");

            // Header
            sheet.Cell(1, 1).Value = "Name";
            sheet.Cell(1, 2).Value = "Code";
            sheet.Cell(1, 3).Value = "GradeName";

            // Style header (đẹp hơn chút)
            var headerRange = sheet.Range("A1:C1");
            headerRange.Style.Font.Bold = true;

            // 🔥 Sheet phụ chứa danh sách khối (ẩn)
            var gradeSheet = workbook.Worksheets.Add("Grades");

            int gradeRow = 1;
            foreach (var grade in grades)
            {
                gradeSheet.Cell(gradeRow, 1).Value = grade.Name;
                gradeRow++;
            }

            // 🔥 Tạo dropdown (reference sang sheet Grades)
            var validationRange = sheet.Range("C2:C500");

            validationRange.CreateDataValidation().List(
                $"=Grades!$A$1:$A${grades.Count}"
            );

            // Ẩn sheet danh sách khối
            gradeSheet.Hide();

            // Auto fit
            sheet.Columns().AdjustToContents();

            // 2. export file
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return Results.File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "class-import-template.xlsx"
            );
        })
        .WithTags("Classes")
        .DisableAntiforgery();
    }
}