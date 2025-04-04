using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class ServiceRequestController:ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(ServiceRequests.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                lstPriority = Priorities.Get(),
                lstAsset = Assets.Get(Session.GetCompanyId(HttpContext)),
                lstComplainant = Complainants.Get(),
                lstRequestType = RequestTypes.Get(),
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{requestId}")]
        public IActionResult Get(int requestId)
        {
            try
            {
                return Ok(ServiceRequest.Get(requestId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ServiceRequest sr)
        { 
            try
            {
                ServiceRequest.Save(sr, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { SRNo = sr.RequestId, Owner = Session.GetUserId(HttpContext) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Submit")]
        public IActionResult Submit([FromBody] Submission _sub)
        {
            try
            {
                ServiceRequest.Submit(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit" }); }
        }

        [HttpGet]
        [Route("GetPending/{DateFrom}/{DateTo}")]
        public IActionResult GetPending(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(Download.Models.ServiceRequests.GetPending(dateFrom, dateTo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPending" }); }
        }
    }
}