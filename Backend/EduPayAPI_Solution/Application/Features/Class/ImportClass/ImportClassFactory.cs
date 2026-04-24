namespace EduPayAPI.Features.Classes.ImportClass;
public class ClassImportFactory
{
    private readonly IEnumerable<IClassImportService> _services;

    public ClassImportFactory(IEnumerable<IClassImportService> services)
    {
        _services = services;
    }

    public IClassImportService Get(string extension)
    {
        return _services.FirstOrDefault(s => s.SupportedExtensions.Contains(extension))
            ?? throw new BadRequestException("File is not supported");
    }
}