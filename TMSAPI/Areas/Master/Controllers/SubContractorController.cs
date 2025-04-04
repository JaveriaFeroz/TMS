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
    public class SubContractorController :ControllerBase
    {
        [HttpGet]
        public IList<SubContractors> Get()
        {
            return SubContractors.Get(false);
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            return Ok(new { lstSubContractorTypes = SubContractorTypes.Get() });
        }

        [HttpGet("{SubContractorid}")]
        public SubContractor Get(short scId)
        {
            return SubContractor.Get(scId);
        }

        [HttpPost]
        public IActionResult Post([FromBody]SubContractor sc)
        {
            try
            {
                SubContractor.Save(sc, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }
    }
}