using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Web;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class APInvoiceController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(APInvoices.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{voucherNo}")]
        public IActionResult Get(string voucherNo)
        {
            try
            {
                return Ok(APInvoice.Get(HttpUtility.UrlDecode(voucherNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetSlips/{voucherId}")]
        public IActionResult GetSlips(int voucherId)
        {
            try
            {
                return Ok(APInvoiceSlip.Get(voucherId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetOSSlips/{SupplierId}/{dateFrom}/{dateTo}")]
        public IActionResult GetOSSlips(short supplierId, DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(APInvoiceSlip.GetOutstandingSlips(supplierId, dateFrom, dateTo, Session.GetCompanyId(HttpContext)));
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
                    lstAccount = CoAs.Get(Session.GetCompanyId(HttpContext), agEnums.AccountType.Subsidiary, Session.GetUserId(HttpContext)),
                    lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                    lstDepartment = Departments.Get(),
                    lstPeriod = Period.GetOpenPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.AP),
                    lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext), true),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] APInvoice pi)
        {
            try
            {
                APInvoice.Save(pi, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Reverse/{voucherNo}")]
        public IActionResult Reverse(string voucherNo)
        {
            try
            {
                APInvoice.Reverse(HttpUtility.UrlDecode(voucherNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Reverse" }); }
        }
    }
}