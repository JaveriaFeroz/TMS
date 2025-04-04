using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Web;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class NoteController : ControllerBase
    {
        [HttpGet()]
        public IList<Notes> Get()
        {
            return Notes.Get(Session.GetCompanyId(HttpContext));
        }

        [HttpGet("{VoucherNo}")]
        public Note Get(string voucherNo)
        {
            return Note.Get(HttpUtility.UrlDecode(voucherNo), Session.GetCompanyId(HttpContext));
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            return Ok(new
            {
                lstAccount = CoAs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                lstBranch = Branches.Get(Session.GetUserId(HttpContext)),
                lstDepartment = Departments.Get(),
                lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext), true),
            });
        }

        [HttpPost]
        public IActionResult Post([FromBody] Note nt)
        {
            try
            {
                Note.Save(nt, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }
    }
}