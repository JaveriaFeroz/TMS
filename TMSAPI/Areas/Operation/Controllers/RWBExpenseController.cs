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
    public class RWBExpenseController : ControllerBase
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

        [HttpGet("{rwbNo}")]
        public IActionResult Get(string rwbNo)
        {
            try
            {
                return Ok(RWBExpense.Get(rwbNo, Session.GetCompanyId(HttpContext)));
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
                lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                lstExpense = Expenses.Get(Session.GetCompanyId(HttpContext)),
                lstSupplier = Suppliers.GetForFuel(Session.GetCompanyId(HttpContext)),
                lstCharge = Charges.Get()
            });
}
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] RWBExpense re)
        {
            try
            {
                RWBExpense.Save(re, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}