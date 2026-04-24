

namespace EduPayAPI.Application.Features.Teachers.GetAll;

public class GetAllTeacherHandler : IRequestHandler<GetAllTeacherQuery, List<TeacherResponse>>
{
    private readonly ITeacherRepository _teacherRepository;

    public GetAllTeacherHandler(ITeacherRepository teacherRepository)
    {
        _teacherRepository = teacherRepository;
    }

    public async Task<List<TeacherResponse>> Handle(
    GetAllTeacherQuery request,
    CancellationToken cancellationToken)
    {
        var teachers = await _teacherRepository.GetAllAsync(
            request.BranchId,
            request.SchoolYearId,
            request.Search,
            request.Status,
            request.DepartmentId,
            cancellationToken);

        return teachers.Select(x => new TeacherResponse
        {
            Id = x.Id,
            Code = x.Code,
            Name = x.Name,
            Email = x.Email,
            PhoneNumber = x.PhoneNumber,
            Status = x.Status,
            BranchId = x.BranchId,
            SchoolYearId = x.SchoolYearId,
        }).ToList();
    }
}