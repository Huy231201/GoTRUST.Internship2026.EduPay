

namespace EduPayAPI.Application.Features.Students.Create;

public class CreateStudentHandler : IRequestHandler<CreateStudentCommand, StudentResponse>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IClassRepository _classRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ISchoolYearRepository _schoolYearRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateStudentHandler(
        IStudentRepository studentRepository,
        IClassRepository classRepository,
        IBranchRepository branchRepository,
        ISchoolYearRepository schoolYearRepository,
        IUnitOfWork unitOfWork)
    {
        _studentRepository = studentRepository;
        _classRepository = classRepository;
        _branchRepository = branchRepository;
        _schoolYearRepository = schoolYearRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<StudentResponse> Handle(
        CreateStudentCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (string.IsNullOrWhiteSpace(request.Code))
            throw new BadRequestException("Code is required");

        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new BadRequestException("FullName is required");

        if (request.ClassId == Guid.Empty)
            throw new BadRequestException("Invalid classId");

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");

        if (request.SchoolYearId == Guid.Empty)
            throw new BadRequestException("Invalid schoolYearId");

        // 🔥 Check Class
        var classEntity = await _classRepository
            .GetByIdAsync(request.ClassId, cancellationToken);

        if (classEntity == null)
            throw new NotFoundException("Class not found");

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
        var isExist = await _studentRepository
            .ExistsByCodeAsync(request.Code, cancellationToken);

        if (isExist)
            throw new BadRequestException("Student code already exists");

        // 🔥 Tạo entity
        var student = new Student(
            request.Code,
            request.FullName,
            request.Gender,
            request.DateOfBirth,
            request.ClassId,
            request.Type,
            request.BranchId,
            request.SchoolYearId,
            request.Email,
            request.PhoneNumber
        );

        // 🔥 Lưu DB
        await _studentRepository.AddAsync(student, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 Return response
        return new StudentResponse
        {
            Id = student.Id,
            Code = student.Code,
            FullName = student.FullName,
            Gender = student.Gender,
            DateOfBirth = student.DateOfBirth,
            ClassId = student.ClassId,
            ClassName = classEntity.Name,
            Type = student.Type,
            Status = student.Status,
            BranchId = student.BranchId,
            SchoolYearId = student.SchoolYearId,
            Email = student.Email,
            PhoneNumber = student.PhoneNumber
        };
    }
}