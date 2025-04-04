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
    public class ARInvoiceController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(ARInvoices.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }
       
        [HttpGet("{invoiceNo}")]
        public IActionResult Get(string invoiceNo)
        {
            try
            {
                return Ok(ARInvoice.Get(HttpUtility.UrlDecode(invoiceNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstPeriod = Period.GetOpenPeriods(Session.GetCompanyId(HttpContext), agEnums.PeriodType.AR),
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), true),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ARInvoice ai)
        {
            try
            {
                ARInvoice.Save(ai, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Reverse/{invoiceNo}")]
        public IActionResult Reverse(string invoiceNo)
        {
            try
            {
                ARInvoice.Reverse(HttpUtility.UrlDecode(invoiceNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));          
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Reverse" }); }
        }
    }
}