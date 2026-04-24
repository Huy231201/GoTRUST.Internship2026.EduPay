

namespace EduPayAPI.Application.Features.Teachers.Update;

public class UpdateTeacherHandler : IRequestHandler<UpdateTeacherCommand, TeacherResponse>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTeacherHandler(
        ITeacherRepository teacherRepository,
        IUnitOfWork unitOfWork)
    {
        _teacherRepository = teacherRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TeacherResponse> Handle(
        UpdateTeacherCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate
        if (request.Id == Guid.Empty)
            throw new BadRequestException("Invalid id");

        if (string.IsNullOrWhiteSpace(request.Code))
            throw new BadRequestException("Code is required");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BadRequestException("Name is required");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new BadRequestException("Email is required");

        // 🔥 Get Teacher
        var teacher = await _teacherRepository
            .GetByIdAsync(request.Id, cancellationToken);

        if (teacher == null)
            throw new NotFoundException("Teacher not found");

        // 🔥 Check duplicate Code (exclude itself)
        var isCodeExist = await _teacherRepository
            .ExistsByCodeAsync(request.Code, cancellationToken);

        if (isCodeExist && teacher.Code != request.Code)
            throw new BadRequestException("Teacher code already exists");

        // 🔥 Check duplicate Email
        var isEmailExist = await _teacherRepository
            .ExistsByEmailAsync(request.Email, cancellationToken);

        if (isEmailExist && teacher.Email != request.Email)
            throw new BadRequestException("Teacher email already exists");

        // 🔥 Update entity
        teacher.Update(
            request.Code,
            request.Name,
            request.Email,
            request.PhoneNumber,
            request.Status
        );

        // 🔥 Save
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
            SchoolYearId = teacher.SchoolYearId,
        };
    }
}