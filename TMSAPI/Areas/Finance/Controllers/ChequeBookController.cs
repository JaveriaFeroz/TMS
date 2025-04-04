using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class ChequeBookController : ControllerBase
    {
        [HttpGet()]
        public IActionResult Get()
        {
            try
            {
                return Ok(ChequeBookDetail.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstBankAccount = CoAs.GetBanks(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{bookId}")]
        public IActionResult Get(short bookId)
        {
            try
            {
                return Ok(ChequeBook.Get(bookId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ChequeBook cb)
        {
            try
            {
                ChequeBook.Save(cb, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}