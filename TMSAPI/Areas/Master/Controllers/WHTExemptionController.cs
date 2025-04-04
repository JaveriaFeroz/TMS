using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class WHTExemptionController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(WHTaxExemptions.Get(Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{exemptionId}")]
        public IActionResult Get(short exemptionId)
        {
                try
                {
                    return Ok(WHTaxExemption.Get(exemptionId, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] WHTaxExemption wht)
        {
            try
            {
                WHTaxExemption.Save(wht, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}