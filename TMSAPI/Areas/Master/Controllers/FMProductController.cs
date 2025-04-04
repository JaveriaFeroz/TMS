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
    public class FMProductController : ControllerBase
    {
        [HttpGet]
        public IList<FMProducts> Get()
        {
            return FMProducts.Get(false);
        }

        [HttpGet("{ProductId}")]
        public Product Get(short ProductId)
        {
            return Product.Get(ProductId);
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            return Ok(new
            {              
               lstClient = Clients.Get(Session.GetCompanyId(HttpContext)),
            });
        }

        [HttpPost]
        public IActionResult Post([FromBody] Product prod)
        {
            try
            {
                Product.Save(prod, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }
    }
}