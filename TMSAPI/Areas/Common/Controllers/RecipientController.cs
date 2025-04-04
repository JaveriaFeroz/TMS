using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Common.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Common/[controller]")]
    public class RecipientController : ControllerBase
    {
        [HttpGet]
        [Route("GetHistory/{workflowId}/{formid}")]
        public IList<FormHistory> GetHisotry(short workflowId, int formId)
        {
            try
            {
                return FormHistory.Get(formId, workflowId);
            }
            catch (Exception ex) { return (IList<FormHistory>)Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetHistory" }); }
        }

        [HttpGet]
        [Route("GetRecipients/{workflowId}/{stateid}")]
        public IActionResult GetRecipients(short workflowId, int stateId)
        {
            try
            {
                return Ok(new { Recipient = Recipient.Get(workflowId, Session.GetCompanyId(HttpContext), stateId) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetRecipients" }); }
        }

        [HttpGet]
        [Route("GetOwner/{workflowId}/{formid}")]
        public IActionResult GetOwner(short workflowId, int formid)
        {
            try
            {
                return Ok(new { Recipient = Recipient.GetOwner(workflowId, formid) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetOwner" }); }
        }

        [HttpGet]
        [Route("GetWORecipients/{woid}/{stateId}")]
        public IActionResult GetWORecipients(int woid, short stateId)
        {
            try
            {
                List<Recipient> recipients = Recipient.GetWORecipients(woid, stateId, out short nextStateId);
                return Ok(new { Recipient = recipients, nextState = nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetWORecipients" }); }
        }

        [HttpGet]
        [Route("GetInvTransferRecipients/{transferNoteId}")]
        public IActionResult GetInvTransferRecipients(int transferNoteId)
        {
            try
            {
                return Ok(new { Recipient = Recipient.GetInvTransferRecipients(transferNoteId, Session.GetCompanyId(HttpContext)) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetInvTransferRecipients" }); }
        }

        [HttpGet]
        [Route("GetInvTransferOwners/{transferNoteId}")]
        public IActionResult GetInvTransferOwners(int transferNoteId)
        {
            try
            {
                return Ok(new { Recipient = Recipient.GetInvTransferOwner(transferNoteId, Session.GetCompanyId(HttpContext)) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetInvTransferOwners" }); }
        }

        [HttpGet]
        [Route("GetClientRateRecipients/{formId}/{stateId}")]
        public IActionResult GetClientRateRecipients(int formId, short stateId)
        {
            try
            {
                List<Recipient> recipients = Recipient.GetClientRateRecipients(formId, stateId, out short nextStateId);
                return Ok(new { Recipient = recipients, nextState = nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetClientRateRecipient" }); }
        }
    }
}