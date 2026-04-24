public class ImportValidationException : Exception
{
    public List<ImportValidationError> Errors { get; }

    public ImportValidationException(List<ImportValidationError> errors)
        : base("Import data is invalid.")
    {
        Errors = errors;
    }
}
