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
    public class TripExpenseSummaryController : ControllerBase
    {
        [HttpGet("{DateFrom}/{DateTo}")]
        public IActionResult Get(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(TripExpenseSummary.Get(dateFrom, dateTo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}