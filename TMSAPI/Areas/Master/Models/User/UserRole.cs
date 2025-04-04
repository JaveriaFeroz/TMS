using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class UserRole :IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? UserRoleId { get; set; }
        public short RoleId { get; set; }
        public string RoleName { get; set; }
        public bool Allowed { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructor
        public UserRole()
        {

        }
        #endregion

        #region internal methods
        internal static List<UserRole> Get(string userId)
        {
            List<UserRole> roles = new List<UserRole>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserRolesById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                roles.Add(new UserRole
                                {
                                    //UserRoleId=                                    dr["UserRoleId"],
                                    RoleId = Convert.ToInt16(dr["RoleId"]),
                                    RoleName = dr["RoleName"].ToString(),
                                    Allowed = Convert.ToBoolean(dr["Allowed"])
                                });
                            }
                        }
                    }
                }
                return roles;
            }
            catch (Exception) { throw; }
        }

        internal static short? GetDefault(string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetUserDefaultRole"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            return Convert.ToInt16(ds.Tables[0].Rows[0]["RoleId"]);
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string userId, List<UserRole> roles, DbTransaction transaction, string updatedBy)
        {
            try
            {
                foreach (UserRole ur in agHelper.GetEdits(roles))
                {
                    using (DbCommand dbCommanddetail = db.GetStoredProcCommand("SaveUserRole"))
                    {
                        //db.AddInParameter(dbCommanddetail, "UserRoleId", SqlDbType.Int, ur.UserRoleId);
                        db.AddInParameter(dbCommanddetail, "NewUserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommanddetail, "RoleId", SqlDbType.SmallInt, ur.RoleId);
                        db.AddInParameter(dbCommanddetail, "Allowed", SqlDbType.Bit, ur.Allowed);
                        db.AddInParameter(dbCommanddetail, "UserId", SqlDbType.VarChar, updatedBy);
                        db.ExecuteNonQuery(dbCommanddetail, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region dispose method
        public void Dispose()
        {
        }
        #endregion
    }
}