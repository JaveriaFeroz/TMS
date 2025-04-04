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
    public class ExpenseSummaryController : ControllerBase
    {
        [HttpGet("{DateFrom}/{DateTo}/{DatebasicId}")]
        public IActionResult Get(DateTime datefrom, DateTime dateto, short datebasicId)
        {
            try
            {
                return Ok(ExpenseSummary.Get(datefrom, dateto, datebasicId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}