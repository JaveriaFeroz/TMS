using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class CompanyController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Companies.Get(Session.GetUserId(HttpContext), false));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{CompanyId}")]
        public IActionResult Get(short companyId)
        {
                try
                {
                    return Ok(Company.Get(companyId));
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
                lstAccount = CoAs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext))
            });
                }
                catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
            }

        [HttpPost]
        public IActionResult Post([FromBody] Company company)
        {
            try
            {
                Company.Save(company, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpGet]
        [Route("GetCompanies")]
        public IActionResult GetAllowedCompanies()
        {
                        try
                        {
                            return Ok(UserCompany.GetAllowed(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetAllowedCompanies" }); }
        }

        [HttpGet]
        [Route("GetCompanyConfig")]
        public IActionResult GetCompanyConfig()
        {
                            try
                            {
                                return Ok(Company.Get(Session.GetCompanyId(HttpContext), true));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetCompanyConfig" }); }
        }

        [HttpPost("{companyId}")]
        [Route("SetUserCompany")]
        public IActionResult SetUserDefaultCompany(short companyId)
        {
            try
            {
                Company.SetUserDefaultCompany(companyId, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveCompany" }); }
        }        
    }
}