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
    public class TechnicianController :ControllerBase
    {
        [HttpGet]
        public IList<Technicians> Get()
        {
            return Technicians.Get(false);
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            return Ok(new { lstTechnicianType = TechnicianTypes.Get() });            
        }

        [HttpGet("{TechnicianId}")]
        public Technician Get(short id)
        {
            return Technician.Get(id);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Technician tn)
        {            
            try
            {
                Technician.Save(tn, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }           
        }
    }
}