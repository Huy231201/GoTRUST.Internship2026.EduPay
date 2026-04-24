namespace EduPayAPI.Domain.Enums;

public enum OtpVerifyResult
{
    Success,
    Invalid,
    Locked,
    Expired,
    Used
}