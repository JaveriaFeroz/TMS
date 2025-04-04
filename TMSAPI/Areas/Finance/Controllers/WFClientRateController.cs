using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class WFClientRateController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok( Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("GetPendingForms")]
        public IActionResult GetPendingForms() 
        {
            try
            {
                return Ok(WFClients.GetPendingForms(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPendingForms" }); }
        }
                
        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                short _companyId = Session.GetCompanyId(HttpContext);
                return Ok(new
                {
                    lstRateType = RateTypes.Get(),
                    lstClient = Clients.Get(_companyId, Session.GetUserId(HttpContext)),
                    lstRoute = Routes.Get(_companyId),
                    lstInvoiceMode = InvoiceModes.Get(),
                    lstCapacity = Capacities.Get(),
                    lstVehicleGroup = VehicleGroups.Get(),
                    lstRouteGroup = RouteGroups.Get(),
                    lstAsset = Assets.Get(_companyId),
                    lstDetention = Detentions.Get(),
                    lstFreightType = FreightTypes.Get()
                    //lstConsignee = Consignees.Get(_companyId),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{formId}")]
        public IActionResult Get(short formId)
        {
            try
            {
                return Ok(WF_ClientRate.Get(formId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] WF_ClientRate cr)
        {
            try
            {
                WF_ClientRate.Save(cr, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { formId = cr.FormId, owner = Session.GetUserId(HttpContext) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Submit")]
        public IActionResult Submit([FromBody] Submission _sub)
        {
            try
            {
                WF_ClientRate.Submit(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit" }); }
        }

        [HttpGet]
        [Route("GetExistingRate/{clientId}")]
        public IActionResult GetExistingRate(short clientId)
        {
            try
            {
                return Ok(ClientRate.Get(clientId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetExistingRates" }); }
        }
    }
}