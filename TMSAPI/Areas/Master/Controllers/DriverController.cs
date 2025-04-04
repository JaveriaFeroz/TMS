using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Drivers.Get(Session.GetCompanyId(HttpContext), false));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{DriverId}")]
        public IActionResult Get(short driverId)
        {
            try
            {
                return Ok(Driver.Get(driverId, Session.GetCompanyId(HttpContext)));
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
                lstQualifications = Qualifications.Get(),
                lstBranch = Branches.Get(),
                lstRelation = Relations.Get(),
                lstSeparationType = SeparationTypes.Get(),
                lstContractors = Contractors.Get(),
                lstMedicalTest = MedicalTests.Get(),
                lstDocumentType = DocumentTypes.GetForDriver(),
                lstTraining = Trainings.Get(),
                lstTrainer = Trainers.Get()
            });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Driver driver)
        {
            try
            {
                if (driver != null)
                {
                    Driver.Save(driver, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                    return Ok("Success");
                }
                else
                    return NotFound("Driver data missing");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Upload")]
        public IActionResult Upload([FromForm] DriverDocument dd)
        {
            try
            {
                dd.ContentType = dd.Image.ContentType;
                dd.FileName = dd.Image.FileName;
                dd.FileContent = convertToBytes(dd.Image);
                DriverDocument.Upload(dd, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "UploadDoc" }); }
        }

        [HttpGet()]
        [Route("View/{documentid}")]
        public IActionResult View(int documentId)
        {
                    try
                    {
                        return Ok(DriverDocument.GetStream(documentId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "ViewDocument" }); }
        }

        [HttpGet]
        [Route("GetDocuments/{driverid}")]
        public IActionResult GetDocuments(int driverId)
        {
                        try
                        {
                            return Ok(DriverDocument.Get(driverId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetDocuments" }); }
        }

        private byte[] convertToBytes(IFormFile image)
        {
            BinaryReader reader = new BinaryReader(image.OpenReadStream());
            return reader.ReadBytes((int)image.Length);
        }
    }
}