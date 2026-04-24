

namespace EduPayAPI.API.Endpoints.Students;

public class DownloadStudentTemplateEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("edupay/v1/students/import-template", async (
            Guid branchId,
            Guid schoolYearId,
            IClassRepository classRepository,
            CancellationToken ct) =>
        {
            // 1. lấy danh sách lớp
            var classes = await classRepository.GetByBranchAndYearAsync(
                branchId,
                schoolYearId,
                ct);

            if (!classes.Any())
            {
                return Results.BadRequest("No classes found in this branch and school year");
            }

            using var workbook = new XLWorkbook();

            // ===== Sheet chính =====
            var sheet = workbook.Worksheets.Add("Template");

            // Header
            sheet.Cell(1, 1).Value = "Code";
            sheet.Cell(1, 2).Value = "FullName";
            sheet.Cell(1, 3).Value = "Email";
            sheet.Cell(1, 4).Value = "PhoneNumber";
            sheet.Cell(1, 5).Value = "Gender";
            sheet.Cell(1, 6).Value = "DateOfBirth";
            sheet.Cell(1, 7).Value = "ClassName";
            sheet.Cell(1, 8).Value = "Type";

            sheet.Range("A1:H1").Style.Font.Bold = true;

            // ===== Sheet Classes =====
            var classSheet = workbook.Worksheets.Add("Classes");

            for (int i = 0; i < classes.Count; i++)
            {
                classSheet.Cell(i + 1, 1).Value = classes[i].Name;
            }

            // ===== Sheet Genders =====
            var genderSheet = workbook.Worksheets.Add("Genders");
            genderSheet.Cell(1, 1).Value = "Nam";
            genderSheet.Cell(2, 1).Value = "Nữ";

            // ===== Sheet Types =====
            var typeSheet = workbook.Worksheets.Add("Types");
            typeSheet.Cell(1, 1).Value = "Nội trú";
            typeSheet.Cell(2, 1).Value = "Ngoại trú";
            typeSheet.Cell(3, 1).Value = "Bán trú";

            // ===== Dropdown =====

            // Gender dropdown
            sheet.Range("E2:E500")
                .CreateDataValidation()
                .List("=Genders!$A$1:$A$2");

            // Type dropdown
            sheet.Range("H2:H500")
                .CreateDataValidation()
                .List("=Types!$A$1:$A$3");

            // Class dropdown
            sheet.Range("G2:G500")
                .CreateDataValidation()
                .List($"=Classes!$A$1:$A${classes.Count}");

            // ===== Ẩn sheet phụ =====
            classSheet.Hide();
            genderSheet.Hide();
            typeSheet.Hide();

            // Format date
            sheet.Column(6).Style.DateFormat.Format = "yyyy-MM-dd";

            // Auto fit
            sheet.Columns().AdjustToContents();

            // ===== Export =====
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return Results.File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "student-import-template.xlsx"
            );
        })
        .WithTags("Students")
        .DisableAntiforgery();
    }
}