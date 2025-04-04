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
    public class TechnicianTypeController :ControllerBase
    {
        [HttpGet]
        public IList<TechnicianTypes> GetTechnicianTypes()
        {
            return TechnicianTypes.Get(false);
        }

        [HttpGet("{TechnicianTypeId}")]
        public TechnicianType Get(short typeId)
        {
            return TechnicianType.Get(typeId);
        }

        [HttpPost]
        public IActionResult Post([FromBody] TechnicianType tt)
        {            
            try
            {
                TechnicianType.Save(tt, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }           
        }
    }
}