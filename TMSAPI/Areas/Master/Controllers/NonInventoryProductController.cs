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
    public class NonInventoryProductController :ControllerBase
    {
        [HttpGet]
        public IList<NonInventoryProducts> Get()
        {
            return NonInventoryProducts.Get(false);
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            return Ok(new {  lstProductType = ProductTypes.Get(), lstUom = UoMs.Get() });
        }

        [HttpGet("{nonproductid}")]
        public NonInventoryProduct Get(short productId)
        {
            return NonInventoryProduct.Get(productId);
        }

        [HttpPost]
        public IActionResult Post([FromBody] NonInventoryProduct np)
        {            
            try
            {
                NonInventoryProduct.SaveNonInventoryProduct(np, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }
    }
}