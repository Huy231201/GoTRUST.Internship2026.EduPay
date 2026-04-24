
namespace EduPayAPI.Application.Features.Classes.Delete;

public class DeleteClassHandler : IRequestHandler<DeleteClassCommand, bool>
{
    private readonly IClassRepository _classRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteClassHandler(
        IClassRepository classRepository,
        IUnitOfWork unitOfWork)
    {
        _classRepository = classRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteClassCommand request,
        CancellationToken cancellationToken)
    {
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid classId");

        var classEntity = await _classRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (classEntity == null)
            throw new NotFoundException("Class not found");

        await _classRepository.DeleteAsync(classEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}