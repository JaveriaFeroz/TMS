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
    public class ReceiptController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(Receipts.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{receiptNo}")]
        public IActionResult Get(string receiptNo)
        {
            try
            {
                return Ok(Receipt.Get(HttpUtility.UrlDecode(receiptNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), true),
                    lstPeriod = Period.GetOpenPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.AP),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Receipt receipt)
        {
            try
            {
                Receipt.Save(receipt, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Reverse/{receiptNo}")]
        public IActionResult Reverse(string receiptNo)
        {
            try
            {
                Receipt.Reverse(HttpUtility.UrlDecode(receiptNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Reverse" }); }
        }

        [HttpGet]
        [Route("GetOSInvoices/{clientId}")]
        public IActionResult GetOutstandingInvoices(short clientId)
        {
            try
            {
                return Ok(ReceiptAllocation.GetOSInvoices(clientId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetInvoices" }); }
        }
    }
}