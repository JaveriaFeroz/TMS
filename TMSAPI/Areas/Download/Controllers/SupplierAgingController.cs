using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Download.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Download/[controller]")]
    public class SupplierAgingController : ControllerBase
    {
        [HttpGet("{DateUpTo}")]
        public IActionResult Get(DateTime DateUpTo)
        {
            try
            {
                return Ok( SupplierAging.Get(DateUpTo, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}