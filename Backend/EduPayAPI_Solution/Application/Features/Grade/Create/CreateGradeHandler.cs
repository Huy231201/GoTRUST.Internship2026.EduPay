
namespace EduPayAPI.Application.Features.Grades.Create;

public class CreateGradeHandler 
    : IRequestHandler<CreateGradeCommand, GradeResponse>
{
    private readonly IGradeRepository _gradeRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ISchoolYearRepository _schoolYearRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateGradeHandler(
        IGradeRepository gradeRepository,
        IBranchRepository branchRepository,
        ISchoolYearRepository schoolYearRepository,
        IUnitOfWork unitOfWork)
    {
        _gradeRepository = gradeRepository;
        _branchRepository = branchRepository;
        _schoolYearRepository = schoolYearRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<GradeResponse> Handle(
        CreateGradeCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BadRequestException("Name is required");

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");

        if (request.SchoolYearId == Guid.Empty)
            throw new BadRequestException("Invalid schoolYearId");

        // 🔥 Check Branch
        var branch = await _branchRepository
            .GetByIdAsync(request.BranchId, cancellationToken);

        if (branch == null)
            throw new NotFoundException("Branch not found");

        // 🔥 Check SchoolYear
        var schoolYear = await _schoolYearRepository
            .GetByIdAsync(request.SchoolYearId, cancellationToken);

        if (schoolYear == null)
            throw new NotFoundException("SchoolYear not found");

        // 🔥 Check trùng
        var isExist = await _gradeRepository
            .ExistsByNameAsync(
                request.Name,
                request.BranchId,
                request.SchoolYearId,
                cancellationToken);

        if (isExist)
            throw new BadRequestException("Grade already exists");

        // 🔥 Tạo entity
        var grade = new Grade(
            request.Name,
            request.Description,
            request.Status,
            request.BranchId,
            request.SchoolYearId
        );

        // 🔥 Lưu DB
        await _gradeRepository.AddAsync(grade, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 Return response
        return new GradeResponse
        {
            Id = grade.Id,
            Name = grade.Name,
            Description = grade.Description,
            Status = grade.Status,
            BranchId = grade.BranchId,
            SchoolYearId = grade.SchoolYearId
        };
    }
}