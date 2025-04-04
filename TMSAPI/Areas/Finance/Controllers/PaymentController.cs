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
    public class PaymentController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(Payments.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{pyNo}")]
        public IActionResult Get(string pyNo)
        {
            try
            {
                return Ok(Payment.Get(HttpUtility.UrlDecode(pyNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstDepartment = Departments.Get(true),
                    lstInstrument = PaymentInstruments.Get(true),
                    lstPeriod = Period.GetOpenPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.AP),
                    lstChequeBook = ChequeBooks.GetActive(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                    lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext), true),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Payment p)
        {
            try
            {
                Payment.Save(p, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Reverse/{pyNo}")]
        public IActionResult Reverse(string pyNo)
        {
            try
            {
                Payment.Reverse(HttpUtility.UrlDecode(pyNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Reverse" }); }
        }

        [HttpGet]
        [Route("GetOSPIVs/{supplierId}")]
        public IActionResult GetOutstandingPIVs(short supplierId)
        {
            try
            {
                return Ok(PaymentAllocation.GetOSInvoices(supplierId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPIVs" }); }
        }
    }
}
//[HttpPost]
//[Route("KnockOff")]
//public IActionResult Allocate([FromBody] List<Allocation> invoices)
//{
//    try
//    {
//        Allocation.Save(invoices, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
//        return Ok("Success");
//    }
//    catch (Exception) { throw; }
//}
