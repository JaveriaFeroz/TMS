using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class JobController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Jobs.Get(Session.GetCompanyId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }
      
        [HttpGet("{JobNo}")]
        public IActionResult Get(string jobNo)
        {
            try
            {
                return Ok(Job.Get(jobNo, Session.GetCompanyId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
            {
                lstSupplier = Suppliers.GetForFuel(Session.GetCompanyId(HttpContext)),
                lstFuelCard = FuelCards.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Job job)
        {
            try
            {
                Job.Save(job, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));   
                return Ok(new { jobNo = job.JobNo });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpGet]
        [Route("GetForClosure/{JobNo}")]
        public IActionResult GetForClosure(string jobNo)
        {
            try
            {
                return Ok(Job.GetForClosure(jobNo, Session.GetCompanyId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        [Route("Close")]
        public IActionResult Close([FromBody] Job job)
        {
            try
            {
                Job.Close(job, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Close" }); }
        }

        [HttpPost]
        [Route("Reopen/{JobNo}/{Reason}")]
        public IActionResult Reopen(string jobNo, string reason)
        {
            try
            {
                Job.ReOpen(jobNo, reason, Session.GetUserId(HttpContext), Session.GetCompanyId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "ReOpen" }); }
        }
    }
}