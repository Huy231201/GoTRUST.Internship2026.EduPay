namespace EduPayAPI.Application.Features.Students.Delete;

public class DeleteStudentHandler 
    : IRequestHandler<DeleteStudentCommand, bool>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteStudentHandler(
        IStudentRepository studentRepository,
        IUnitOfWork unitOfWork)
    {
        _studentRepository = studentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteStudentCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid studentId");

        // 🔥 Check tồn tại
        var student = await _studentRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (student == null)
            throw new NotFoundException("Student not found");

        // 🔥 Xóa
        await _studentRepository.DeleteAsync(student, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}