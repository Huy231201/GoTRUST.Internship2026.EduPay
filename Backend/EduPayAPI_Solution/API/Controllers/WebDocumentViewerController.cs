

namespace EduPayAPI.API.Controllers;

[ApiExplorerSettings(IgnoreApi = true)]
[ApiController]
[Route("DXXRDV")]
public class CustomWebDocumentViewerController : WebDocumentViewerController
{
    public CustomWebDocumentViewerController(
        IWebDocumentViewerMvcControllerService controllerService)
        : base(controllerService)
    {
    }
}