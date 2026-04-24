namespace EduPayAPI.Application.Features.SchoolYears;

public class SchoolYearResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public DateOnly StartDate { get; init; } = default!;
    public DateOnly EndDate { get; init; } = default!;
    public string? Description { get; init; }
}