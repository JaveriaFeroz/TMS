using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class ExpenseHeadController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Expenses.Get(Session.GetCompanyId(HttpContext), false));
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
                lstChargeCode = CWChargeCodes.Get(),
            });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{ExpenseId}")]
        public IActionResult Get(short ExpenseId)
        {
                    try
                    {
                        return Ok(Expense.Get(ExpenseId, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Expense eh)
        {
            try
            {
                Expense.Save(eh, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}