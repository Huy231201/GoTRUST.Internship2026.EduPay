namespace EduPayAPI.Application.Features.Branches.Delete;

public class DeleteBranchHandler : IRequestHandler<DeleteBranchCommand>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteBranchHandler> _logger;

    public DeleteBranchHandler(
        IBranchRepository branchRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteBranchHandler> logger)
    {
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(
        DeleteBranchCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Get
        var branch = await _branchRepository
            .GetByIdAsync(request.BranchId, cancellationToken);

        if (branch is null)
            throw new NotFoundException("Branch not found");

        // 2. Không cho xóa main
        if (branch.IsMain)
            throw new BadRequestException("Cannot delete main branch");

        // 3. Delete
        await _branchRepository.DeleteAsync(branch, cancellationToken);

        // 4. Save
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}