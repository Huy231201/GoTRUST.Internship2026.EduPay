namespace EduPayAPI.Application.Features.Classes.GetAll;

public class GetAllClassHandler 
    : IRequestHandler<GetAllClassQuery, List<ClassResponse>>
{
    private readonly IClassRepository _classRepository;

    public GetAllClassHandler(IClassRepository classRepository)
    {
        _classRepository = classRepository;
    }

    public async Task<List<ClassResponse>> Handle(
        GetAllClassQuery request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate basic
        // if (request.SchoolYearId == Guid.Empty)
        //     throw new BadRequestException("Invalid schoolYearId");

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");

        // 🔥 gọi repository
        var classes = await _classRepository.GetListAsync(
            request.SchoolYearId,
            request.BranchId,
            request.GradeId,
            request.Search,
            cancellationToken
        );

        // 🔥 map sang response, dùng navigation property để lấy tên
        var result = classes.Select(c => new ClassResponse
        {
            Id = c.Id,
            Name = c.Name,
            Code = c.Code,
            GradeId = c.GradeId,
            GradeName = c.Grade?.Name ?? string.Empty,
            BranchId = c.BranchId,
            BranchName = c.Branch?.Name ?? string.Empty,
            IsMain = c.Branch != null && c.Branch.IsMain,
            SchoolYearId = c.SchoolYearId
        }).ToList();

        return result;
    }
}