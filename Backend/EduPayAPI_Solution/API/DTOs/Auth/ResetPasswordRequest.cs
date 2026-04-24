
public class ResetPasswordRequest
{
    public string ResetToken { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
}