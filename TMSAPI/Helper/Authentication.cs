using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Master.Models;
using TMSAPI.Common.Models;

namespace TMSAPI.Helper
{
    class Authentication
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region internal methods

        internal static UserCredential AuthenticateUser(string userId, string passWord)
        {
            UserCredential _uc = new UserCredential { UserActive = false, AuthStatus = agEnums.AuthenticationStatus.InvalidUserId };
            try
            {
                // Add null checks
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(passWord))
                {
                    throw new ArgumentException("UserId and Password cannot be null or empty");
                }

                using (DbCommand dc = db.GetStoredProcCommand("uspAuthenticateUser"))
                {
                    db.AddInParameter(dc, "UserId", SqlDbType.VarChar, userId);
                    using (DataTable dt = db.ExecuteDataSet(dc).Tables[0])
                    {
                        if (dt.Rows.Count > 0)
                        {
                            DataRow dr = dt.Rows[0];

                            // Add null checks for database fields
                            if (dr["UserActive"] == null || dr["Password"] == null)
                            {
                                throw new InvalidOperationException("Critical user data is missing");
                            }

                            _uc.UserActive = Convert.ToBoolean(dr["UserActive"]);
                            _uc.UserId = userId;

                            if (!Convert.ToBoolean(dr["UserActive"]))
                                _uc.AuthStatus = agEnums.AuthenticationStatus.UserIdDisabled;
                            else if (passWord != agHelper.MaskPassword(dr["Password"].ToString(), false))
                                _uc.AuthStatus = agEnums.AuthenticationStatus.InvalidPassword;
                            else
                            {
                                _uc.AuthStatus = agEnums.AuthenticationStatus.Successful;
                                _uc.UserName = dr["UserName"]?.ToString() ?? string.Empty;
                                _uc.CompanyId = UserCompany.GetDefault(_uc.UserId);
                            }
                        }
                        else
                        {
                            throw new Exception($"User not found: {userId}");
                        }
                    }
                }
                return _uc;
            }
            catch (Exception ex)
            {
                // Log the full exception details
                Console.WriteLine($"Authentication Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                // Re-throw to preserve original stack trace
                throw;
            }
        }           //internal static UserCredential AuthenticateUser(string _userId, string _passWord)
        //{
        //    UserCredential _uc = new UserCredential { UserActive = false, AuthStatus = agEnums.AuthenticationStatus.InvalidUserId };
        //    try
        //    {
        //        using (DbCommand dc = db.GetStoredProcCommand("uspAuthenticateUser"))
        //        {
        //            db.AddInParameter(dc, "UserId", SqlDbType.VarChar, _userId);
        //            using (DataTable dt = db.ExecuteDataSet(dc).Tables[0])
        //            {
        //                if (dt.Rows.Count > 0)
        //                {
        //                    DataRow dr = dt.Rows[0];
        //                    {
        //                        _uc.UserActive = Convert.ToBoolean(dr["UserActive"]);
        //                        _uc.UserId = _userId;
        //                        if (!Convert.ToBoolean(dr["UserActive"]))
        //                            _uc.AuthStatus = agEnums.AuthenticationStatus.UserIdDisabled;
        //                        else if (_passWord != agHelper.MaskPassword(dr["Password"].ToString(), false))
        //                            _uc.AuthStatus = agEnums.AuthenticationStatus.InvalidPassword;
        //                        else
        //                        {
        //                            if (Convert.ToBoolean(dr["ForcePwdChange"]))
        //                                _uc.AuthStatus = agEnums.AuthenticationStatus.ForcePasswordChange;
        //                            else
        //                                _uc.AuthStatus = agEnums.AuthenticationStatus.Successful;

        //                            _uc.UserName = dr["UserName"].ToString();
        //                            _uc.CompanyId = UserCompany.GetDefault(_uc.UserId);
        //                        }
        //                    }
        //                }
        //                else
        //                    throw new Exception("The User Id doesn`t exist or has been deactivated!");
        //            }
        //        }
        //        return _uc;
        //    }
        //    catch (Exception)
        //    { throw; }
        //}
        #endregion
    }
}
