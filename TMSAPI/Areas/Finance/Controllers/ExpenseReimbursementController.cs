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
    public class ExpenseReimbursementController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(ExpReimbursements.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                    lstPeriod = Period.GetPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.AP)
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{requestId}")]
        public IActionResult Get(short requestId)
        {
            try
            {
                return Ok(ExpReimbursement.Get(requestId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetPending/{branchId}/{periodFromId}/{periodToId}")]
        public IActionResult Get(short branchId, short periodFromId, short periodToId)
        {
            try
            {
                return Ok(ExpReimbursementDetail.Get(branchId, periodFromId, periodToId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ExpReimbursement er)
        {
            try
            {
                ExpReimbursement.Save(er, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));            
                return Ok(new { requestId = er.RequestId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        //[HttpPost]
        //[Route("Close/{requestNo}")]
        //public IActionResult CloseExpenseReImbursement(int requestNo)
        //{
        //    try
        //    {
        //        ExpReimbursement.Complete(requestNo, Session.GetUserId(HttpContext));
        //        return Ok("Success");
        //    }
        //    catch (Exception) { throw; }
        //}
    }
}