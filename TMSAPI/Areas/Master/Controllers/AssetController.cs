using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class AssetController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Assets.Get(Session.GetCompanyId(HttpContext), false));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("{AssetId}")]
        public IActionResult GetAsset(short assetId)
        {
                try
                {
                    return Ok(Asset.Get(assetId, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet("GetStatus/{AssetCode}")]
        public IActionResult GetStatus(string assetCode)
        {
                    try
                    {
                        return Ok(Asset.GetStatus(assetCode, Session.GetCompanyId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetStatus" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
                {
                    try
                    {
                        return Ok(new
                        {
                            lstAssetType = AssetType.Get(),
                            lstAssetStatus = AssetStatus.Get(),
                            lstCity = Cities.Get(),
                            lstBranch = Branches.Get(),
                            lstTrailor = Assets.GetByAssetType(Session.GetCompanyId(HttpContext), 2),
                            lstClient = Clients.Get(Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext)),
                            lstLeaseType = LeaseTypes.Get(),
                            lstCapacity = Capacities.Get(),
                            lstMake = Makes.Get(),
                            lstDriver = Drivers.Get(Session.GetCompanyId(HttpContext)),
                            lstSupplier = Suppliers.Get(Session.GetCompanyId(HttpContext)),
                        });
                    }
                    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookups" }); }
                }

        [HttpPost]
        public IActionResult Post([FromBody] Asset asset)
        {
            try
            {
                Asset.Save(asset, Session.GetCompanyId(HttpContext), Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("SaveStatus/{AssetId}/{statusId}/{newstatusId}/{reason}")]
        public IActionResult SaveStatus(short assetId, short statusId, short newstatusId, string reason)
        {
            try
            {
                Asset.SaveStatus(assetId, statusId, newstatusId, reason, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveAssetStatus" }); }
        }

        [HttpGet]
        [Route("GetAssetMaintHistory/{AssetId}")]
        public IActionResult GetMaintenanceHistory(int assetId)
        {
                            try
                            {
                                return Ok(MaintHistory.Get(assetId, Session.GetUserId(HttpContext)));
                    }
                    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetMaintenanceHistory" }); }
                }
    }
}