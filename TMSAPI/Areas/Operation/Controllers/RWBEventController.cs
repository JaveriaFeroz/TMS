using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Areas.Operation.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Controllers
{
    ///to be reviewed later, serious issues in this code
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class RWBEventController : ControllerBase
    {
        [HttpGet("{RwbNo}")]
        public IActionResult Get(string rwbNo)
        {  try
            {
                return Ok(new{data = TripInfo.Get(rwbNo, Session.GetCompanyId(HttpContext)) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetEvents/{rwbNo}")]
        public IActionResult GetEvents(string rwbNo)
        {
            try
            {
                return Ok(RWBEvents.Get(rwbNo, Session.GetUserId(HttpContext), Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetEvents" }); }
        }

        [HttpGet]
        [Route("GetRWBConsignees/{rwbId}")]
        public IActionResult GetRWBConsignee(int rwbId)
        {
            try
            {
                return Ok(Consignees.GetByRWB(rwbId));
        }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetConsignees" }); }
        }

        [HttpGet]
        [Route("GetShortage/{rwbId}")]
        public IActionResult GetShortage(int rwbId)
        {
            try
            {
                return Ok(Shortage.Get(rwbId));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetShortage" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
            {
                lstSupplier = Suppliers.GetForOutSourcedVehicle(Session.GetCompanyId(HttpContext)),
                lstCity = Cities.Get(),
                lstAsset = Assets.GetByAssetType(Session.GetCompanyId(HttpContext), 1),
                lstDriver = Drivers.Get(Session.GetCompanyId(HttpContext)),
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet]
        [Route("GetAssetLookups/{rwbId}/{assetypeid}")]
        public IActionResult GetAssetLookups(int rwbId, short assetypeid)
        {
            try
            {
                return Ok(new
            {
                lstAsset = Assets.GetForRWB(rwbId, Session.GetCompanyId(HttpContext), assetypeid),
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetAssetLookups" }); }
        }

        [HttpPost]
        [Route("SaveRWBEvent")]
        public IActionResult Post([FromBody] RWBEvent rwbevent)
        {
            try
            {
                RWBEvent.Save(rwbevent, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Cancel/{rwbNo}/{cancelDate}")]
        public IActionResult Post(string rwbNo, string cancelDate)
        {
            try
            {
                RWBEvent.Cancel(rwbNo, cancelDate,  Session.GetUserId(HttpContext), Session.GetCompanyId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Cancel" }); }
        }
    }
}