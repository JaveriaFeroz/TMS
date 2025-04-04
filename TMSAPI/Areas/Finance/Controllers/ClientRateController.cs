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
    public class ClientRateController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [Route("{clientId}")]
        public IActionResult Get(short clientId)
        {
            try
            {
                return Ok(ClientRate.Get(clientId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        //[HttpGet]
        //[Route("GetRateDetail/{formId}")]
        //public ClientRate GetRateDetail(short formId)
        //{
        //    return ClientRate.Get( formId, Session.GetCompanyId(HttpContext));
        //}

        //access to post is ceased based on finance requirement
        //[HttpPost]
        //public IActionResult Post([FromBody] ClientRate cr)
        //{
        //    try
        //    {
        //        ClientRate.Save(cr, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
        //        return Ok();
        //    }
        //    catch (Exception) { throw; }
        //}

        //[HttpPost]
        //[Route("SubmitRate")]
        //public IActionResult SubmitRate([FromBody] Submission _sub)
        //{
        //    try
        //    {
        //        ClientRate.Submit(_sub);
        //        return Ok("Success");
        //    }
        //    catch (Exception) { throw; }
        //}
    }
}