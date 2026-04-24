namespace EduPayAPI.Application.Features.GlobalSearch;

public class SearchHandler 
    : IRequestHandler<SearchQuery, SearchResponse>
{
    private readonly IClassRepository _classRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly ITeacherRepository _teacherRepository;

    public SearchHandler(
        IClassRepository classRepository,
        IStudentRepository studentRepository,
        ITeacherRepository teacherRepository)
    {
        _classRepository = classRepository;
        _studentRepository = studentRepository;
        _teacherRepository = teacherRepository;
    }

    public async Task<SearchResponse> Handle(
        SearchQuery request,
        CancellationToken cancellationToken)
    {
        // validate
        var keyword = request.Search?.Trim();

        if (string.IsNullOrWhiteSpace(keyword))
            return new SearchResponse();

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");
        
           if (request.SchoolYearId == Guid.Empty)
            throw new BadRequestException("Invalid schoolYearId");

        //  gọi repository
        var classes = await _classRepository.SearchAsync(
            request.SchoolYearId,
            request.BranchId,
            keyword,
            cancellationToken);

        var students = await _studentRepository.SearchAsync(
            request.SchoolYearId,
            request.BranchId,
            keyword,
            cancellationToken);

        var teachers = await _teacherRepository.SearchAsync(
            request.SchoolYearId,
            request.BranchId,
            keyword,
            cancellationToken);

        // map response
        var result = new SearchResponse
        {
            Classes = classes.Select(c => new ClassItem
            {
                Id = c.Id,
                Name = c.Name
            }).ToList(),

            Students = students.Select(s => new StudentItem
            {
                Id = s.Id,
                Name = s.FullName,
                ClassName = s.Class?.Name ?? string.Empty
            }).ToList(),

            Teachers = teachers.Select(t => new TeacherItem
            {
                Id = t.Id,
                Name = t.Name
            }).ToList()
        };

        return result;
    }
}