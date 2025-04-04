using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Download.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Download/[controller]")]
    public class CreditFuelController : ControllerBase
    {
        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
                {
                    lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                    lstSupplier = Suppliers.GetForFuel(Session.GetCompanyId(HttpContext))
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" }); }
        }

        [HttpGet("{DateFrom}/{DateTo}/{ClientId}/{SupplierId}")]
        public IActionResult Get(DateTime datefrom, DateTime dateto, short clientId, short supplierId)
        {
            try
            {
                return Ok(CreditFuel.Get(datefrom, dateto, clientId, supplierId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }
    }
}