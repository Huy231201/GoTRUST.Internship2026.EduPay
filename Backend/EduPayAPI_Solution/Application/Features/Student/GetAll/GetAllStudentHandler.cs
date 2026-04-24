

namespace EduPayAPI.Application.Features.Students.GetAll;

public class GetStudentsHandler 
    : IRequestHandler<GetStudentsQuery, List<StudentResponse>>
{
    private readonly IStudentRepository _studentRepository;

    public GetStudentsHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<List<StudentResponse>> Handle(
        GetStudentsQuery request,
        CancellationToken cancellationToken)
    {
        var students = await _studentRepository.GetAllAsync(
            request.Search,
            request.Status,
            request.ClassId,
            request.BranchId,
            request.SchoolYearId,
            cancellationToken);

        return students.Select(x => new StudentResponse
        {
            Id = x.Id,
            Code = x.Code,
            FullName = x.FullName,
            Gender = x.Gender,
            DateOfBirth = x.DateOfBirth,
            ClassId = x.ClassId,
            ClassName = x.Class.Name,
            Type = x.Type,
            Status = x.Status,
            BranchId = x.BranchId,
            SchoolYearId = x.SchoolYearId,
            Email = x.Email,
            PhoneNumber = x.PhoneNumber
        }).ToList();
    }
}