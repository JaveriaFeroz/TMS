using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class WOReImbursementController:ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Models.WOReImbursements.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch(Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
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
                    lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext)),
                    lstSubCategory = SubCategories.Get(),
                    lstLeaseType = LeaseTypes.Get(),
                    lstPeriod = Period.GetPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.Operational)
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{requestNo}")]
        public IActionResult Get(short requestNo)
        {
            try
            {
                return Ok(WOReImbursement.Get(requestNo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
        
        [HttpGet]
        [Route("GetPendingWO/{branchId}/{supplierId}/{subCategoryId}/{periodFromId}/{periodToId}/{leasetypeid}")]
        public IActionResult GetPendingWO(short branchId, short supplierId,
            short subCategoryId, short periodFromId, short periodToId, short leaseTypeId)
        {
            try
            {
                return Ok(WOReImbursementDetail.GetForReImbursement(branchId, supplierId, Session.GetCompanyId(HttpContext),
                    subCategoryId, periodFromId, periodToId, leaseTypeId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPendingWO" }); }
        }

        [HttpGet]
        [Route("Extract/{branchId}/{supplierId}/{subCategoryId}/{PeriodFromId}/{PeriodToId}")]
        public IActionResult Extract(short branchId, short supplierId, short subCategoryId, short periodFromId, short periodToId)
        {
            try
            {
                return Ok(Download.Models.WOReImbursements.Get(branchId, supplierId, subCategoryId, periodFromId, periodToId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Extract" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] WOReImbursement wor)
        {
            try
            {
                WOReImbursement.Save(wor, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new{ wor.RequestId } );
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Close/{requestNo}")]
        public IActionResult CloseWorkOrderReImbursement(int requestNo)
        {
            try
            {
                WOReImbursement.Close(requestNo, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Close" }); }
        }
    }
}