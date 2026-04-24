
namespace EduPayAPI.Application.Features.Teachers.Delete;

public class DeleteTeacherHandler : IRequestHandler<DeleteTeacherCommand>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTeacherHandler(
        ITeacherRepository teacherRepository,
        IUnitOfWork unitOfWork)
    {
        _teacherRepository = teacherRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        DeleteTeacherCommand request,
        CancellationToken cancellationToken)
    {
        var teacher = await _teacherRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (teacher == null)
            throw new NotFoundException("Teacher not found");

        await _teacherRepository.DeleteAsync(teacher, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}