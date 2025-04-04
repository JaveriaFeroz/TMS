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
    public class FinancialPeriodController : ControllerBase
    {
        [HttpGet("{periodTypeId}")]
        public IActionResult Get(short periodTypeId)
        {
            try
            {
                return Ok(Period.Get(Session.GetCompanyId(HttpContext), periodTypeId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        [Route("Close/{periodTypeId}")]
        public IActionResult Close(short periodTypeId)
        {
            try
            {
                Period.Close(Session.GetCompanyId(HttpContext), periodTypeId, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Close" }); }
        }
    }
}