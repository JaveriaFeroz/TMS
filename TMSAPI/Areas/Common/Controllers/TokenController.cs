using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TMSAPI.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Common.Controllers
{
    [Route("Common/[controller]")]
    [ApiController]

    public class TokenController : ControllerBase
    {
        private readonly IConfiguration _config;

        #region constructor
        public TokenController(IConfiguration config)
        {
            _config = config;
        }
        #endregion

        #region public methods
        [AllowAnonymous]
        //[EnableCors("CorsPolicy")]
        [HttpPost]

        public IActionResult CreateToken([FromBody] UserCredential _credential)
        {
            IActionResult response;
            try
            {
                UserCredential _uc = Authentication.AuthenticateUser(_credential.UserId, _credential.Password);

                // Always treat successful authentication the same way
                if (_uc.AuthStatus == agEnums.AuthenticationStatus.Successful)
                {
                    var tokenString = buildToken(_uc);
                    response = Ok(new
                    {
                        accessToken = tokenString,
                        message = "Successful",
                        status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK
                    });
                }
                else
                {
                    response = new ObjectResult(new
                    {
                        accessToken = string.Empty,
                        message = _uc.AuthStatus.ToString(),
                        status = Microsoft.AspNetCore.Http.StatusCodes.Status406NotAcceptable
                    });
                }
            }
            catch (Exception ex)
            {
                var error = new
                {
                    accessToken = string.Empty,
                    message = ex.Message,
                    status = Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError
                };
                response = new ObjectResult(error);
            }
            return response;
        }
        //public IActionResult CreateToken([FromBody] UserCredential _credential)
        //{
        //    IActionResult response;// = Unauthorized();
        //    try
        //    {
        //        UserCredential _uc = Authentication.AuthenticateUser(_credential.UserId, _credential.Password);
        //        if (_uc.AuthStatus == agEnums.AuthenticationStatus.Successful)
        //        {
        //            var tokenString = buildToken(_uc);
        //            response = Ok(new { accessToken = tokenString, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK });
        //        }
        //        else if (_uc.AuthStatus == agEnums.AuthenticationStatus.ForcePasswordChange)
        //        {
        //            var tokenString = buildToken(_uc);
        //            response = Ok(new { accessToken = tokenString, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK });
        //        }
        //        else
        //            response = new ObjectResult(new { accessToken = string.Empty, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status406NotAcceptable });
        //    }
        //    catch (Exception ex)
        //    {
        //        var error = new
        //        {
        //            accessToken = string.Empty,
        //            message = ex.Message,
        //            status = Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError
        //        };
        //        response = new ObjectResult(error);
        //    }
        //    return response;
        //}

        [HttpPost]
        [Route("ReIssue")]
        public IActionResult ReIssue([FromBody] UserCredential _credential)
        {
            IActionResult response;
            try
            {
                var tokenString = revalidate(_credential.UserId, _credential.UserName, _credential.CompanyId.Value);
                response = Ok(new
                {
                    accessToken = tokenString,
                    message = agEnums.AuthenticationStatus.Successful.ToString(),
                    status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK
                });
                return response;
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "ReIssue Token" }); }
        }
        #endregion

        #region private methods
        private string buildToken(UserCredential _uc)
        {
            var _claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, _uc.UserId),
                new Claim(JwtRegisteredClaimNames.GivenName, _uc.UserName),
                new Claim(JwtRegisteredClaimNames.Gender, _uc.CompanyId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Audience"], _claims,
              expires: DateTime.Now.AddMinutes(300),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string revalidate(string _userId, string _userName, short _companyid)
        {
            var _claims = new[] {
                 new Claim(JwtRegisteredClaimNames.Sub, _userId),
                new Claim(JwtRegisteredClaimNames.GivenName, _userName),
                new Claim(JwtRegisteredClaimNames.Gender, _companyid.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Audience"], _claims,
              expires: DateTime.Now.AddMinutes(300),
              signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion
    }
}