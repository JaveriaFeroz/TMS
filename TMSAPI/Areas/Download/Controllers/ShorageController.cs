using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Download.Models;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Download/[controller]")]
    public class ShortageController : ControllerBase
    {
        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try { 
            return Ok(new
            {
                lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                lstAsset = Assets.Get(Session.GetCompanyId(HttpContext)),
                lstPeriod = Period.GetPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.Operational)
            });
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{PeriodFrom}/{PeriodTo}/{ClientId}/{AssetId}")]
        public IActionResult Get(short periodfrom, short periodto, short clientId, short AssetId)
        {
            try
            {
                return Ok(Shortage.Get(periodfrom, periodto, clientId, AssetId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}