using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Common.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Common/[controller]")]
    public class FormGroupController : ControllerBase
    {
        [HttpGet]
        [Route("ActiveForms/{workflowId}")]
        public IActionResult ActiveForms(short workflowId)
        {
            try
            {
                return Ok(MyForm.ActiveForms(workflowId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetActiveForms" }); }
        }

        [HttpGet]
        [Route("CompletedForms/{workflowId}")]
        public IActionResult CompletedForms(short workflowId)
        {
            try
            {
                return Ok(MyForm.CompletedForms(workflowId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetCompletedForm" }); }
        }

        [HttpGet]
        [Route("SentForms/{workflowId}")]
        public IActionResult SentForms(short workflowId)
        {
            try
            {
                return Ok(MyForm.SentForms(workflowId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SentForms" }); }
        }
    }
}