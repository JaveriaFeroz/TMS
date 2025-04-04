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
    public class SubContractorTypeController :ControllerBase
    {
        [HttpGet]
        public IList<SubContractorTypes> Get()
        {
            return SubContractorTypes.Get(false);
        }

        [HttpGet("{SubContractorTypeId}")]
        public SubContractorType Get(short typeId)
        {
            return SubContractorType.Get(typeId);
        }

        [HttpPost]
        public IActionResult Post([FromBody] SubContractorType sct)
        {            
            try
            {
                SubContractorType.Save(sct, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }
    }
}