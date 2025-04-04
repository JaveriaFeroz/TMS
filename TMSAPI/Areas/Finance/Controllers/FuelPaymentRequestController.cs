using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Finance.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class FuelPaymentRequestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(FuelPaymentReqs.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
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
                    lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext)),
                    lstCard = FuelCards.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
        }

        [HttpGet("{requestId}")]
        public IActionResult Get(short requestId)
        {
            try
            {
                return Ok(FuelPaymentReq.Get(requestId, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetForCard/{cardId}/{dateFrom}/{dateTo}")]
        public IActionResult GetForCard(short cardId, DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(FuelPaymentReqDetail.GetForCard(cardId, dateFrom, dateTo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetForSupplier/{supplierId}/{dateFrom}/{dateTo}")]
        public IActionResult GetForSupplier(short supplierId, DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return Ok(FuelPaymentReqDetail.GetForSupplier(supplierId, dateFrom, dateTo, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }

        }

        [HttpPost]
        public IActionResult Post([FromBody] FuelPaymentReq fpr)
        {
            try
            {
                FuelPaymentReq.Save(fpr, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok(new { requestId = fpr.RequestId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        //[HttpPost]
        //[Route("Close/{requestNo}")]
        //public IActionResult CloseFuelPayment(short requestNo)
        //{
        //    try
        //    {
        //        FuelPaymentReq.Complete(requestNo, Session.GetUserId(HttpContext));
        //        return Ok("Success");
        //    }
        //    catch (Exception) { throw; }
        //}
    }
}