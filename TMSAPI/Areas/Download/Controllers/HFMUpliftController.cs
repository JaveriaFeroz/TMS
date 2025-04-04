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
    public class HFMUpliftController : ControllerBase
    {        
        [HttpGet("{DateUpTo}")]
        public IActionResult Get(string DateUpTo)
        {
            try
            {
                return Ok(HFMUplift.Get(DateUpTo, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}