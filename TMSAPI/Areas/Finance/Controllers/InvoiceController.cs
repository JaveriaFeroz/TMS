using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Web;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class InvoiceController : ControllerBase
    {
        [HttpPost]
        [Route("UnInvoice/{InvoiceNo}")]
        public IActionResult UnInvoice(string invoiceNo)
        {
            try
            {
                Invoice.UnInvoice(HttpUtility.UrlDecode(invoiceNo) , Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "UnInvoice" }); }
        }

        [HttpPost]
        [Route("GenerateInvoice/{clientId}/{invoiceFrom}/{invoiceTo}/{reApplyRate}/{taxRate}")]
        public IActionResult GenerateInvoice(short clientId, DateTime invoiceFrom, DateTime invoiceTo, bool reApplyRate, decimal taxRate)
        {
            try
            {
                Invoice.Generate(clientId, invoiceFrom, invoiceTo, reApplyRate, taxRate, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), out short _invoicecount);
                return Ok(new { InvoiceCount = _invoicecount });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GenerateInvoice" }); }        
        }

        [HttpPost]
        [Route("SubmitInvoice")]
        public IActionResult SubmitInvoice([FromBody] Submission sub)
        {
            try
            {
                Invoice.Submit(sub);
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit" }); }
        }
    }
}