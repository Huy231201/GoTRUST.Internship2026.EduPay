namespace EduPayAPI.Application.Features.Teachers.Create;

public class CreateTeacherHandler : IRequestHandler<CreateTeacherCommand, TeacherResponse>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ISchoolYearRepository _schoolYearRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTeacherHandler(
        ITeacherRepository teacherRepository,
        IBranchRepository branchRepository,
        ISchoolYearRepository schoolYearRepository,
        IUnitOfWork unitOfWork)
    {
        _teacherRepository = teacherRepository;
        _branchRepository = branchRepository;
        _schoolYearRepository = schoolYearRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TeacherResponse> Handle(
        CreateTeacherCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (string.IsNullOrWhiteSpace(request.Code))
            throw new BadRequestException("Code is required");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BadRequestException("Name is required");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new BadRequestException("Email is required");

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");

        if (request.SchoolYearId == Guid.Empty)
            throw new BadRequestException("Invalid schoolYearId");

        // 🔥 Check Branch
        var branch = await _branchRepository
            .GetByIdAsync(request.BranchId, cancellationToken);

        if (branch == null)
            throw new NotFoundException("Branch not found");

        // 🔥 Check SchoolYear
        var schoolYear = await _schoolYearRepository
            .GetByIdAsync(request.SchoolYearId, cancellationToken);

        if (schoolYear == null)
            throw new NotFoundException("SchoolYear not found");

        // 🔥 Check trùng Code
        var isCodeExist = await _teacherRepository
            .ExistsByCodeAsync(request.Code, cancellationToken);

        if (isCodeExist)
            throw new BadRequestException("Teacher code already exists");

        // 🔥 Check trùng Email
        var isEmailExist = await _teacherRepository
            .ExistsByEmailAsync(request.Email, cancellationToken);

        if (isEmailExist)
            throw new BadRequestException("Teacher email already exists");

        // 🔥 Create entity
        var teacher = new Teacher(
            request.Code,
            request.Name,
            request.BranchId,
            request.SchoolYearId,
            request.Email,
            request.PhoneNumber
        );

        // 🔥 Save DB
        await _teacherRepository.AddAsync(teacher, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 Response
        return new TeacherResponse
        {
            Id = teacher.Id,
            Code = teacher.Code,
            Name = teacher.Name,
            Email = teacher.Email,
            PhoneNumber = teacher.PhoneNumber,
            Status = teacher.Status,
            BranchId = teacher.BranchId,
            SchoolYearId = teacher.SchoolYearId
        };
    }
}