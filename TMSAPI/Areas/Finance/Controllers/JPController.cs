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
    public class JPController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(JPs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{voucherNo}")]
        public IActionResult Get(string voucherNo)
        {
            try
            {
                return Ok(JP.Get(HttpUtility.UrlDecode(voucherNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetTrips/{voucherId}")]
        public IActionResult GetTrips(int voucherId)
        {
            try
            {
                return Ok(JPTrip.Get(voucherId));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetOSTrips/{clientId}/{dateFrom}/{dateTo}")]
        public IActionResult GetOSTrips(short? clientId, DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(JPTrip.GetOSTrips(clientId == -1 ? null : clientId, dateFrom, dateTo, Session.GetCompanyId(HttpContext)));
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
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] JP jp)
        {
            try
            {
                JP.Save(jp, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
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
                JP.Reverse(HttpUtility.UrlDecode(voucherNo), Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Reverse" }); }
        }
    }
}