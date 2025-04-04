using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class ShipperController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Shippers.Get(Session.GetCompanyId(HttpContext), false));
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
                lstCity = Cities.Get(),
                lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
            });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{shipperId}")]
        public IActionResult Get(short shipperId)
        {
                    try
                    {
                        return Ok(Shipper.Get(shipperId, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
        
        [HttpPost]
        public IActionResult Post([FromBody] Shipper shipper)
        {
            try
            {
                Shipper.Save(shipper, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}