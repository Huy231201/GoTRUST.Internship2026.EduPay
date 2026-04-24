

namespace EduPayAPI.Application.Features.Students.Update;

public class UpdateStudentHandler 
    : IRequestHandler<UpdateStudentCommand, StudentResponse>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IClassRepository _classRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStudentHandler(
        IStudentRepository studentRepository,
        IClassRepository classRepository,
        IUnitOfWork unitOfWork)
    {
        _studentRepository = studentRepository;
        _classRepository = classRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<StudentResponse> Handle(
        UpdateStudentCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid studentId");

        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new BadRequestException("FullName is required");

        if (request.ClassId == Guid.Empty)
            throw new BadRequestException("Invalid classId");

        // 🔥 Check student
        var student = await _studentRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (student == null)
            throw new NotFoundException("Student not found");

        // 🔥 Check class
        var classEntity = await _classRepository
            .GetByIdAsync(request.ClassId, cancellationToken);

        if (classEntity == null)
            throw new NotFoundException("Class not found");

        // 🔥 Update entity
        student.Update(
            request.Code,
            request.FullName,
            request.Gender,
            request.DateOfBirth,
            request.ClassId,
            request.Type,
            request.Email,
            request.PhoneNumber,
            request.Status
        );

        await _studentRepository.UpdateAsync(student, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 🔥 Return
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