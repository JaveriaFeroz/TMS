using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Insurance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Insurance/[controller]")]
    public class InsPolicyController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try { 
            return Ok(InsPolicies.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), false));
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
                lstInsuranceCompany = InsCompanies.Get(),
                lstAsset = Assets.GetByAssetType(Session.GetCompanyId(HttpContext), 1),
            });
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{PolicyId}")]
        public IActionResult Get(short PolicyId)
        {
            try
            {
                return Ok(InsPolicy.Get(PolicyId, Session.GetUserId(HttpContext), Session.GetCompanyId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] InsPolicy ip)
        {
            try
            {
                InsPolicy.Save(ip, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}