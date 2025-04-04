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
    public class WorkOrderController:ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try { 
            return Ok(WorkOrders.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                lstWOType = WOType.Get((short)agEnums.ParentDocumentType.WorkOrder),
                lstProduct = Products.Get(),
                lstCharge = MaintenanceCharges.Get(),
                lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                lstAsset = Assets.Get(Session.GetCompanyId(HttpContext)),
                lstPriority = Priorities.Get(),
                lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext)),
                lstSubCategory = SubCategories.Get()
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{wono}")]
        public IActionResult Get(string woNo)
        {
            try
            {
                return Ok(WorkOrder.Get(woNo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] WorkOrder wo)
        {
            try
            {
                WorkOrder.Save(wo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { woNo = wo.WONo, woId= wo.WOId,  Owner = Session.GetUserId(HttpContext) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpGet]
        [Route("GetServiceRequests")]
        public IActionResult GetServiceRequestsForWO()
        {
            try
            {
                return Ok(ServiceRequestForWO.Get(Session.GetCompanyId(HttpContext),Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetServiceRequests" }); }
        }

        [HttpGet]
        [Route("GetActivities/{wono}")]
        public IActionResult GetActivities(int woNo)
        {
            try
            {
                return Ok(WOActivity.Get(woNo));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetActivities" }); }
        }

        [HttpGet]
        [Route("GetClosed/{periodFromId}/{periodToId}")]
        public IActionResult GetClosed(short periodFromId, short periodToId)
        {
            try
            {
                return Ok(Download.Models.WorkOrders.GetClosed(periodFromId, periodToId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetClosed" }); }
        }

        [HttpGet]
        [Route("GetPending/{DateFrom}/{DateTo}")]
        public IActionResult GetPending(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(Download.Models.WorkOrders.GetPending(dateFrom, dateTo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPending" }); }
        }

        [HttpPost]
        [Route("Submit")]
        public IActionResult Submit([FromBody] Submission _sub)
        {
            try
            {
                WorkOrder.Submit(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit" }); }
        }

        [HttpPost]
        [Route("SaveActual")]
        public IActionResult SaveActual([FromBody] WorkOrder wo)
        {
            try
            {
                WorkOrder.SaveActual(wo, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveActualWO" }); }
        }
    }
}