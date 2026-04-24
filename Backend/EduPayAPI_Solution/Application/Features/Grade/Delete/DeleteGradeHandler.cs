

namespace EduPayAPI.Application.Features.Grades.Delete;

public class DeleteGradeHandler 
    : IRequestHandler<DeleteGradeCommand, bool>
{
    private readonly IGradeRepository _gradeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteGradeHandler(
        IGradeRepository gradeRepository,
        IUnitOfWork unitOfWork)
    {
        _gradeRepository = gradeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteGradeCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid gradeId");

        // 🔥 Check tồn tại
        var grade = await _gradeRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (grade == null)
            throw new NotFoundException("Grade not found");

        // 🔥 Delete
        await _gradeRepository.DeleteAsync(grade, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}