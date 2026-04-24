

namespace EduPayAPI.Application.Features.Branches.GetById;

public class GetBranchByIdHandler 
    : IRequestHandler<GetBranchByIdQuery, BranchResponse>
{
    private readonly IBranchRepository _branchRepository;

    public GetBranchByIdHandler(IBranchRepository branchRepository)
    {
        _branchRepository = branchRepository;
    }

    public async Task<BranchResponse> Handle(
        GetBranchByIdQuery request,
        CancellationToken cancellationToken)
    {
        var branch = await _branchRepository
            .GetByIdAsync(request.BranchId, cancellationToken);

        if (branch == null)
            throw new Exception("Không tìm thấy cơ sở");

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