using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Inventory.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Inventory/[controller]")]
    public class InvTransferController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try {
                return Ok(InvTransfers.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{transferId}")]
        public IActionResult Get(short transferId)
        {
            try {
                return Ok(InvTransfer.Get(transferId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstProduct = Products.Get(),
                    lstFBranch = Branches.Get(Session.GetUserId(HttpContext)),
                    lstTBranch = Branches.Get(),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        [Route("Transfer")]
        public IActionResult Transfer([FromBody] Submission _sub)
        {
            try
            {
                InvTransfer.Transfer(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "TransferInventory" }); }
        }

        [HttpPost]
        [Route("Receive")]
        public IActionResult Receive([FromBody] Submission _sub)
        {
            try
            {
                InvTransfer.Receive(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "ReceiveInventory" }); }
        }

        [HttpPost]
        [Route("Cancel")]
        public IActionResult Cancel([FromBody] Submission _sub)
        {
            try
            {
                InvTransfer.Cancel(_sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "CancelTransfer" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] InvTransfer it)
        {
            try
            {
                InvTransfer.Save(it, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { it.TransferId, Owner = Session.GetUserId(HttpContext) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveInvTransfer" }); }
        }
    }
}