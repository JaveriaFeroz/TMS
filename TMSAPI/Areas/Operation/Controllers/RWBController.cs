using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class RWBController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(RWBs.Get(Session.GetCompanyId(HttpContext)));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("GetClients")]
        public IActionResult GetClients()
        {
            try
            {
                return Ok(Clients.GetForRWB(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetClients" }); }
        }

        [HttpGet("{rwbNo}")]
        public IActionResult Get(string rwbNo)
        {
            try
            {
                return Ok(RWB.Get(rwbNo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetForUpdate/{rwbNo}")]
        public IActionResult GetForUpdate(string rwbNo)
        {
            try
            {
                return Ok(RWB.GetForUpdate(rwbNo, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
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
                lstCapacity = Capacities.Get(),
                lstClient = Clients.GetForRWB(_companyId, Session.GetUserId(HttpContext)),
                lstAsset = Assets.GetWithCapacity(_companyId),
                lstConsignee = Consignees.Get(_companyId),
                lstShipper = Shippers.Get(_companyId),
                lstRoute = Routes.Get(_companyId),
                lstSKU = SKUs.GetWithClients(_companyId),
                lstCategory = Categories.GetWithClients(Session.GetCompanyId(HttpContext)),
                lstCharge = Charges.Get()
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet]
        [Route("GetLookupsForShipper")]
        public IActionResult GetLookupsForShipper()
        {
            try
            {
                return Ok(new
            {
                lstConsignee = Consignees.Get(Session.GetCompanyId(HttpContext)),
                lstCategory = Categories.GetWithClients(Session.GetCompanyId(HttpContext)),
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookupsForShipper" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] RWB rwb)
        {
            try
            {
                RWB.Save(rwb, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { rwbNo = rwb.RWBNo });
                //return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("SaveUpdates")]
        public IActionResult SaveUpdates([FromBody] RWB rwb)
        {
            try
            {
                RWB.Update(rwb, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveUpdates" }); }
        }
    }
}