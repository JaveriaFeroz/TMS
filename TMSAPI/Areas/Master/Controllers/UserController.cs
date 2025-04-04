using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class UserController : Controller
    {

        [HttpGet]
        [Route("GetAccess")]
        public IActionResult GetAccess()
        {
            try
            {
                return Ok(UserAccess.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetAccess" }); }
        }

        [HttpGet]
        [Route("GetMenu")]
        public IActionResult GetMenu()
        {
                try
                {
                    return Ok(Menu.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetMenu" }); }
        }

        [HttpGet]
        [Route("GetUserCompany")]
        public IActionResult GetUserCompany()
        {
                    try
                    {
                        return Ok(UserCompany.GetDefault(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetUserCompany" }); }
        }

        [HttpGet]
        [Route("GetUserRole")]
        public IActionResult GetUserRole()
        {
                        try
                        {
                            return Ok(UserRole.GetDefault(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetUserRole" }); }
        }

        [Route("ChangePassword")]
        [HttpPost]
        public IActionResult ChangePassword([FromBody] PasswordChange _pc)
        {
            //string _userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            try
            {
                if(PasswordChange.ChangePassword(Session.GetUserId(HttpContext), _pc.OldPassword, _pc.NewPassword))
                    return Json(new { success = true, message = "Password Changed Successfully!" });
                else
                    return Json(new { success = false, message = "An Error occurred while attempting password change!"});
            }
            catch (Exception ex) { return Ok(Conflict(new ErrorModel { Message = ex.Message, FieldName = "ChangePassword" })); }
        }

        [AllowAnonymous]
        [HttpPost("{userId}")]
        [Route("SendPassword")]
        public IActionResult SendPassword(string userId)
        {
            try
            {
                UserProfile.SendPassword(userId);//Session.GetUserId(HttpContext));
                return Json(new { success = true, message = "Password sent to email address associated with this user profile!"});
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SendPassowrd" }); }
        }

        //[HttpPost]
        //[Route("Refresh/{companyid}")]
        //public IActionResult Refresh(short companyid)
        //{
        //    try
        //    {
        //        string _userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        //        string _userName = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName).Value;
        //      //  Refresh(_userId, _userName, companyid);
        //        return Ok("Success");
        //    }
        //    catch (Exception) { throw; }
        //}

        //public string Refresh(string _userId, string _userName, short _companyid)
        //{

        //    var user = User as ClaimsPrincipal;
        //    var identity = user.Identity as ClaimsIdentity;
        //    identity.AddClaim(new Claim(ClaimTypes.Role, "somenewrole"));

        //}
    }
}