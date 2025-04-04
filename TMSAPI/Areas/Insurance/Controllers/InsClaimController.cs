using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using TMSAPI.Areas.Insurance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Insurance/[controller]")]
    public class InsClaimController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(InsClaims.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
                {
                    lstDocumentTypes = DocumentTypes.GetForInsurance(),
                    lstAsset = Assets.GetByAssetType(Session.GetCompanyId(HttpContext), 1),
                    lstInsuranceType = InsTypes.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{claimId}")]
        public IActionResult Get(short claimId)
        {
            try
            {
                return Ok(InsClaim.Get(claimId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] InsClaim ic)
        {
            try
            {
                InsClaim.Save(ic, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Upload")]
        public IActionResult Upload([FromForm] InsClaimDoc ic)
        {
            try
            {
                ic.ContentType = ic.Image.ContentType;
                ic.FileName = ic.Image.FileName;
                ic.FileContent = convertToBytes(ic.Image);
                InsClaimDoc.Upload(ic, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Upload" }); }
        }

        [HttpGet()]
        [Route("View/{documentid}")]
        public IActionResult View(int documentid)
        {
            try
            {
                return Ok(InsClaimDoc.GetStream(documentid));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "View" }); }
        }

        [HttpGet]
        [Route("GetDocuments/{claimid}")]
        public IActionResult GetDocuments(int claimId)
        {
            try
            {
                return Ok(InsClaimDoc.Get(claimId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetDocumentsList" }); }
        }

        [HttpPost]
        [Route("Close/{claimId}")]
        public IActionResult Close(short claimId)
        {
            try
            {
                InsClaim.Close(claimId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Close" }); }
        }

        private byte[] convertToBytes(IFormFile image)
        {
            BinaryReader reader = new BinaryReader(image.OpenReadStream());
            return reader.ReadBytes((int)image.Length);
        }
    }
}