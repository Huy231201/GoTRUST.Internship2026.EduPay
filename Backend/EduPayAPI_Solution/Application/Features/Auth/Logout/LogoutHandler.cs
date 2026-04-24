namespace EduPayAPI.Application.Features.Auth.Logout;
public class LogoutHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IRefreshTokenRepository _repo;
    private readonly IUnitOfWork _unitOfWork;

    public LogoutHandler(
        IRefreshTokenRepository repo,
        IUnitOfWork unitOfWork)
    {
        _repo = repo;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        LogoutCommand request,
        CancellationToken ct)
    {
        var token = await _repo.GetByTokenAsync(request.RefreshToken, ct);

        // không cần throw -> logout luôn thành công
        if (token is null)
            return true;

        token.Revoke();

        await _unitOfWork.SaveChangesAsync(ct);

        return true;
    }
}