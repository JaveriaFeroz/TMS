using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;
using TMSAPI.Areas.Master.Models;

namespace TMSAPI.Areas.Common.Models
{
    public class UserProfile : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public List<UserRole> Roles { get; set; } = new List<UserRole>();
        public List<UserOption> Options { get; set; } = new List<UserOption>();
        public List<UserBranch> Branches { get; set; } = new List<UserBranch>();
        public List<UserCity> Cities { get; set; } = new List<UserCity>();
        public List<UserCompany> Companies { get; set; } = new List<UserCompany>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public UserProfile()
        {
        }
        #endregion

        #region internal methods
        internal static UserProfile Get(string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetUserById"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new UserProfile
                            {
                                UserId = dr["UserId"].ToString(),
                                UserName = dr["UserName"].ToString(),
                                BranchName = dr["BranchName"].ToString(),
                                Email = dr["EmailAddress"].ToString(),
                                DepartmentName = dr["DepartmentName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["UserActive"]),
                                Footer = new agFooter(dr),
                                Options = UserOption.Get(userId),
                                Branches = UserBranch.Get(userId),
                                Roles = UserRole.Get(userId),
                                Cities = UserCity.Get(userId),
                                Companies = UserCompany.Get(userId)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(UserProfile up, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    #region Grid data
                    UserOption.Save(up.UserId, up.Options, transaction, userId);
                    UserBranch.Save(up.UserId, up.Branches, transaction, userId);
                    UserRole.Save(up.UserId, up.Roles, transaction, userId);
                    UserCity.Save(up.UserId, up.Cities, transaction, userId);
                    UserCompany.Save(up.UserId, up.Companies, transaction, userId);
                    #endregion
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        internal static bool SendPassword(string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("uspSendPassword"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
        }
        #endregion

        #region dispose method
        public void Dispose()
        {
        }
        #endregion
    }
}