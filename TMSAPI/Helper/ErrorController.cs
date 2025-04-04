using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TMSAPI.Helper
{
    [AllowAnonymous]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [Route("/error")]
        public IActionResult Error([FromServices] IWebHostEnvironment webHostEnvironment) //=> Problem();
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

            return Problem(
                detail: null, type: null,//context.Error.StackTrace,
                 title: context.Error.Message,
                 statusCode: 400);
        }
    }
}
