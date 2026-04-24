
namespace EduPayAPI.Application.Features.Branches.Create;

public class CreateBranchHandler : IRequestHandler<CreateBranchCommand, BranchResponse>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateBranchHandler(
        IBranchRepository branchRepository,
        IUnitOfWork unitOfWork
        ) // Inject UnitOfWork vào đây
    {
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<BranchResponse> Handle(
        CreateBranchCommand request,
        CancellationToken cancellationToken)
    {
        //  check duplicate code
    var codeExists = await _branchRepository.ExistsByCodeAsync(
        request.SchoolId,
        request.Code,
        null,
        cancellationToken
    );

    if (codeExists)
        throw new BadRequestException("Branch code already exists");

    // check duplicate name
    var nameExists = await _branchRepository.ExistsByNameAsync(
        request.SchoolId,
        request.Name,
        null,
        cancellationToken
    );

    if (nameExists)
        throw new BadRequestException("Branch name already exists");

        // 1. Khởi tạo Entity Branch
        var branch = new Branch(
            request.SchoolId,
            request.Name,
            request.Code,
            request.Address,
            false, // IsMain = false vì đây là tạo thêm cơ sở phụ
            request.Type,
            request.Level,
            request.Email,
            request.Phone,
            request.TaxCode
        );

        // 2. Lưu vào cơ sở dữ liệu
        await _branchRepository.AddAsync(branch, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 3. Trả về Response (Xử lý null an toàn)
        return new BranchResponse
        {
            Id = branch.Id,
            Name = branch.Name,
            Code = branch.Code,
            Level = branch.Level, 
            IsMain = branch.IsMain,
            TaxCode = branch.TaxCode,
            Email = branch.Email,
            Phone = branch.Phone,
            Address = branch.Address,
            Type = branch.Type
        };
    }
}