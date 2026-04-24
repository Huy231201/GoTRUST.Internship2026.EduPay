namespace EduPayAPI.Application.Features.Branches.Update;

public class UpdateBranchHandler : IRequestHandler<UpdateBranchCommand, BranchResponse>
{
    private readonly IBranchRepository _branchRepository;
    private readonly ISchoolRepository _schoolRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBranchHandler(
        IBranchRepository branchRepository,
        ISchoolRepository schoolRepository,
        IUnitOfWork unitOfWork)
    {
        _branchRepository = branchRepository;
        _schoolRepository = schoolRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<BranchResponse> Handle(
        UpdateBranchCommand request,
        CancellationToken cancellationToken)
    {
        // 🔥 1. Lấy branch
        var branch = await _branchRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (branch is null)
            throw new NotFoundException("Branch not found");

        // 🔥 check duplicate code
        var codeExists = await _branchRepository.ExistsByCodeAsync(
            branch.SchoolId,
            request.Code,
            request.Id,
            cancellationToken
        );

        if (codeExists)
            throw new BadRequestException("Branch code already exists");

        // 🔥 check duplicate name
        var nameExists = await _branchRepository.ExistsByNameAsync(
            branch.SchoolId,
            request.Name,
            request.Id,
            cancellationToken
        );

        if (nameExists)
            throw new BadRequestException("Branch name already exists");

        // 🔥 3. Update branch
        branch.Update(
            request.Name,
            request.Code,
            request.Address,
            request.Type,
            request.Level,
            request.TaxCode,
            request.Email,
            request.Phone
        );

        await _branchRepository.UpdateAsync(branch, cancellationToken);

        // 🔥 4. Nếu là branch chính → update school
        if (branch.IsMain)
        {
            var school = await _schoolRepository
                .GetMainSchoolAsync(cancellationToken);

            if (school is null)
                throw new NotFoundException("School not found");

            school.Update(
                request.Name,
                request.Code,
                request.Level ?? school.Level,
                request.TaxCode ?? school.TaxCode,
                request.Email ?? school.Email,
                request.Phone ?? school.Phone,
                school.Website,      // giữ nguyên
                school.Principal,   // giữ nguyên
                request.Address ?? school.Address,
                request.Type ?? school.Type
            );

            await _schoolRepository.UpdateAsync(school, cancellationToken);
        }

        // 🔥 5. Save
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 6. Response
        return new BranchResponse
        {
            Id = branch.Id,
            Name = branch.Name,
            Code = branch.Code,
            Address = branch.Address,
            Phone = branch.Phone,
            Email = branch.Email,
            TaxCode = branch.TaxCode,
            Level = branch.Level,
            Type = branch.Type
        };
    }
}