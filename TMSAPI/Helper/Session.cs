using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;

namespace TMSAPI.Helper
{
    public class Session
    {
        #region internal methods
        internal static string GetUserId(HttpContext _hc)
        {
            HttpContextAccessor ha = new HttpContextAccessor();
            return _hc.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        }

        internal static short GetCompanyId(HttpContext _hc)
        {
            HttpContextAccessor ha = new HttpContextAccessor();
            return Convert.ToInt16(_hc.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Gender).Value);
        }
        #endregion
    }
}
