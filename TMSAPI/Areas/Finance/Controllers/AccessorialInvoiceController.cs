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
    public class AccessorialInvoiceController : ControllerBase
    {
        [HttpGet("{workFlowId}")]
        public IActionResult Get(short workFlowId)
        {
            try { 
            return Ok(AccessorialInvoices.Get(workFlowId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                    lstCharge = AccessorialCharges.Get(),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{invoiceNo}/{workFlowId}")]
        public IActionResult Get(string invoiceNo, short workFlowId)
        {
            try
            {
                return Ok(AccessorialInvoice.Get(HttpUtility.UrlDecode(invoiceNo), workFlowId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] AccessorialInvoice ai)
        {
            try
            {
                AccessorialInvoice.Save(ai, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}