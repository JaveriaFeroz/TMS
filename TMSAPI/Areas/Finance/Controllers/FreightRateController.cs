using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class FreightRateController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(FreightRate.Get(Session.GetCompanyId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }               

        [HttpPost]
        public IActionResult Post([FromBody] FreightRate fr)
        {
            try
            {
                FreightRate.Save(fr, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}