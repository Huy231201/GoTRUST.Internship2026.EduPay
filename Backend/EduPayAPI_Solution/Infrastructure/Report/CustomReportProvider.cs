

namespace EduPayAPI.Infrastructure.Report;

public class CustomReportProvider : IReportProvider
{
    private readonly IMediator _mediator;

    public CustomReportProvider(IMediator mediator)
    {
        _mediator = mediator;
    }

    public XtraReport GetReport(string id, ReportProviderContext context)
    {
        if (id.StartsWith("StudentReport"))
        {
            // ===== PARSE QUERY STRING =====
            var parts = id.Split('?');
            var queryString = parts.Length > 1 ? parts[1] : "";

            var query = System.Web.HttpUtility.ParseQueryString(queryString);

            Guid? branchId = Guid.TryParse(query["BranchId"], out var b) ? b : null; // ✅ thêm
            Guid? schoolYearId = Guid.TryParse(query["SchoolYearId"], out var sy) ? sy : null;
            Guid? gradeId = Guid.TryParse(query["GradeId"], out var g) ? g : null;
            Guid? classId = Guid.TryParse(query["ClassId"], out var c) ? c : null;
            int? status = int.TryParse(query["Status"], out var s) ? s : null;

            // ===== LOAD REPORT FILE =====
            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Report",
                "StudentReport.repx"
            );

            if (!File.Exists(path))
            {
                throw new Exception($"Report file not found: {path}");
            }

            var report = XtraReport.FromFile(path, true);

            // ===== CALL MEDIATOR =====
            var data = _mediator.Send(new GetStudentReportQuery(
                branchId,       
                schoolYearId,
                gradeId,
                classId,
                status
            )).Result;

            // ===== BIND DATA =====
            report.DataSource = data;

            return report;
        }

        throw new Exception("Report not found");
    }
}
