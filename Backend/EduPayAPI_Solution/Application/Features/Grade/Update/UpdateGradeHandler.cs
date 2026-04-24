

namespace EduPayAPI.Application.Features.Grades.Update;

public class UpdateGradeHandler 
    : IRequestHandler<UpdateGradeCommand, GradeResponse>
{
    private readonly IGradeRepository _gradeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateGradeHandler(
        IGradeRepository gradeRepository,
        IUnitOfWork unitOfWork)
    {
        _gradeRepository = gradeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<GradeResponse> Handle(
        UpdateGradeCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid gradeId");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BadRequestException("Name is required");

        // 🔥 Check tồn tại
        var grade = await _gradeRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (grade == null)
            throw new NotFoundException("Grade not found");

        // 🔥 Check trùng (optional nhưng nên có)
        var isDuplicate = await _gradeRepository
            .ExistsByNameAsync(
                request.Name,
                grade.BranchId,
                grade.SchoolYearId,
                cancellationToken);

        if (isDuplicate && grade.Name != request.Name)
            throw new BadRequestException("Grade name already exists");

        // 🔥 Update entity
        grade.Update(
            request.Name,
            request.Description,
            request.Status
        );

        // 🔥 Save
        await _gradeRepository.UpdateAsync(grade, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 Return
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