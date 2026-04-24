

namespace EduPayAPI.Application.Features.Auth.Register;

public class RegisterHandler
    : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ISchoolRepository _schoolRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterHandler(
        IUserRepository userRepository,
        ISchoolRepository schoolRepository,
        IBranchRepository branchRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _schoolRepository = schoolRepository;
        _branchRepository = branchRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<RegisterResponse> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        // 🔥 1. Check account đã tồn tại
        var existingUser = await _userRepository
            .GetByAccountAsync(request.Account, cancellationToken);

        if (existingUser != null)
            throw new ConflictException("Account already exists");

        // 🔥 2. Check mã trường
        if (await _schoolRepository.ExistsByCodeAsync(request.School.Code, cancellationToken))
            throw new ConflictException("School code already exists");

        // 🔥 3. Hash password
        var hashedPassword = _passwordHasher.Hash(request.Password);

        // 🔥 4. Tạo School
        var school = new School(
            request.School.Name,
            request.School.Code,
            request.School.Level,
            request.School.TaxCode,
            request.School.Email,
            request.School.Phone,
            request.School.Website,
            request.School.Principal,
            request.School.Address,
            request.School.Type
        );

        // 🔥 5. Tạo Main Branch
        var mainBranch = new Branch(
            school.Id,
            school.Name,
            school.Code,
            school.Address ?? "",
            true,
            school.Type,
            school.Level,
            school.Email,
            school.Phone,
            school.TaxCode
        );

        // 🔥 6. Tạo User (Role set cứng)
        var user = new User(
            request.Account, // nếu bạn đã đổi thành Account thì sửa ở đây
            hashedPassword,
            request.FullName,
            UserRole.Admin,
            school.Id
        );

        // 🔥 7. Add vào DbContext
        await _schoolRepository.AddAsync(school, cancellationToken);
        await _branchRepository.AddAsync(mainBranch, cancellationToken);
        await _userRepository.AddAsync(user, cancellationToken);

        // 🔥 8. Save 1 lần
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 9. Response
        return new RegisterResponse
        {
            UserId = user.Id,
            Account = user.Account, // nếu rename → Account
            FullName = user.FullName,

            School = new SchoolInfo
            {
                Id = school.Id,
                Name = school.Name,
                Code = school.Code
            },

            CreatedAt = user.CreatedAt
        };
    }
}