namespace EduPayAPI.API.DTOs.SchoolYear;
public record UpdateSchoolYearRequest(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Description
);