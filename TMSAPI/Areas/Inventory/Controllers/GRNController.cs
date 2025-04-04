using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Inventory.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Inventory/[controller]")]
    [ApiController]
    public class GRNController:ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(GRNs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{grnno}")]
        public IActionResult Get(string  grnno)
        {
            try
            {
                return Ok(GRN.Get(grnno, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetGRN" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
                {
                    lstGRNType = ReceiptTypes.Get(),
                    lstMoP = PaymentModes.Get(),
                    lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                    lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext)),
                    lstProduct = Products.Get(true),
                    lstUom = UoMs.Get(true),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet]
        [Route("GetPODetails/{pono}")]
        public IActionResult GetPODetail(int poNo)
        {
            try {
                return Ok(GRNDetail.GetFromPO(poNo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPODetails" }); }
        }

        [HttpGet]
        [Route("GetPOs")]
        public IActionResult GetPOs()
        {
            try { 
            return Ok(PurchaseOrders.GetPOsForGRN(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPOs" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] GRN grn)
        {            
            try
            {
                GRN.Save(grn, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveGRN" }); }
        }
    }
}