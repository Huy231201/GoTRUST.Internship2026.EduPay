namespace EduPayAPI.Features.Students.ImportStudent;
public class StudentImportFactory
{
    private readonly IEnumerable<IStudentImportService> _services;

    public StudentImportFactory(IEnumerable<IStudentImportService> services)
    {
        _services = services;
    }

    public IStudentImportService Get(string extension)
    {
        return _services.FirstOrDefault(s => s.SupportedExtensions.Contains(extension))
            ?? throw new BadRequestException("File is not supported");
    }
}