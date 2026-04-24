namespace EduPayAPI.Application.Features.Branches.GetAll;

public class GetAllBranchHandler 
    : IRequestHandler<GetAllBranchQuery, List<BranchResponse>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly ICacheService _cache; 

    public GetAllBranchHandler(
        IBranchRepository branchRepository,
        ICacheService cache) 
    {
        _branchRepository = branchRepository;
        _cache = cache;
    }

    public async Task<List<BranchResponse>> Handle(
        GetAllBranchQuery request,
        CancellationToken cancellationToken)
    {
        var cacheKey = $"branches:bySchool:{request.SchoolId}";

        // 1. Try cache
        var cached = await _cache.GetAsync<List<BranchResponse>>(cacheKey);
        if (cached is not null)
        {
            return cached;
        }

        // 2. DB
        var branches = await _branchRepository
            .GetBySchoolIdAsync(request.SchoolId, cancellationToken);

        var result = branches.Select(b => new BranchResponse
        {
            Id = b.Id,
            Name = b.Name,
            Code = b.Code,
            Level = b.Level,
            IsMain = b.IsMain,
            TaxCode = b.TaxCode,
            Email = b.Email,
            Phone = b.Phone,
            Address = b.Address,
            Type = b.Type
        }).ToList();

        //  3. Save cache
        await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(10));

        return result;
    }
}