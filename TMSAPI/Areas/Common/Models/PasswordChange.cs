using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Common.Models
{
    public class PasswordChange
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        #endregion

        #region internal methods
        internal static bool ChangePassword(string _userId, string _oldPassword, string _newPassword)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("ARS_usp_ChangePassword"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "oldPassword", SqlDbType.VarChar, _oldPassword);
                    db.AddInParameter(dbCommand, "newPassword", SqlDbType.VarChar, _newPassword);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
        }
        #endregion
    }
}