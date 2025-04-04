using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Download.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Controllers
{
    //[Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Download/[controller]")]
    public class PLSummaryController : ControllerBase
    {
        [HttpGet]
        [Route("GetRoutePL/{dateFrom}/{dateTo}/{jobPeriodId}/{dateBasisId}")]
        public IActionResult GetRoutePL(DateTime datefrom, DateTime dateto, short jobPeriodId, short dateBasisId)
        {
            try
            {
                return Ok(PLSummary.GetRoutePL(datefrom, dateto, jobPeriodId, dateBasisId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetRoutePL" }); }
        }
       
        [HttpGet]
        [Route("GetConsigneePL/{dateFrom}/{dateTo}/{jobPeriodId}/{dateBasisId}")]
        public IActionResult GetPL(DateTime dateFrom, DateTime dateTo, short jobPeriodId, short dateBasisId)
        {
            try
            {
                return Ok(PLSummary.GetConsigneePL(dateFrom, dateTo, jobPeriodId, dateBasisId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}