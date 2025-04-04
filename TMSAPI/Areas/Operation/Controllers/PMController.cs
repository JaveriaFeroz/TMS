using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class PMController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(PMs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), false));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
                {
                    lstActivity = Activities.Get(),
                    lstCapacity = Capacities.Get(),
                    lstAssetMake = Makes.Get()
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{PMId}")]
        public IActionResult Get(short pmId)
        {
            try
            {
                return Ok(PM.Get(pmId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] PM pm)
        {            
            try
            {
                PM.Save(pm, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}