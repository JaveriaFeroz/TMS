using Newtonsoft.Json;
using TMSAPI.Helper;

namespace TMSAPI.Common.Models
{
    public class UserCredential
    {
        #region public properties
        public string UserId { set; get; }
        public string UserName { set; get; }
        public string Password { set; get; }
        [JsonProperty(PropertyName = "Status")]
        public bool UserActive { get; set; }
        public  short? CompanyId { get; set; }
        public agEnums.AuthenticationStatus AuthStatus { get; set; }
        #endregion
    }
}