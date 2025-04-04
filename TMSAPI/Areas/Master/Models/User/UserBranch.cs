using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class UserBranch : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? UserBranchId { get; set; }
        public short BranchId { get; set; }
        public string BranchName { get; set; }
        public bool Allowed { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructors
        public UserBranch()
        {
        }
        #endregion

        #region internal methods
        internal static List<UserBranch> Get(string _userId)
        {
            List<UserBranch> branches = new List<UserBranch>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserBranchesById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                branches.Add(new UserBranch
                                {
                                    //                                    dr["UserBranchId"],
                                    BranchId = Convert.ToInt16(dr["BranchId"]),
                                    BranchName = dr["BranchName"].ToString(),
                                    Allowed = Convert.ToBoolean(dr["Allowed"])
                                });
                            }
                        }
                    }
                }
                return branches;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string userId, List<UserBranch> branches, DbTransaction _transaction, string updatedBy)
        {
            try
            {
                foreach (UserBranch ub in agHelper.GetEdits(branches))
                {
                    using (DbCommand dbCommanddetail = db.GetStoredProcCommand("SaveUserBranch"))
                    {
                        db.AddInParameter(dbCommanddetail, "NewUserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommanddetail, "BranchId", SqlDbType.VarChar, ub.BranchId);
                        db.AddInParameter(dbCommanddetail, "Allowed", SqlDbType.Bit, ub.Allowed);
                        db.AddInParameter(dbCommanddetail, "UserId", SqlDbType.VarChar, updatedBy);
                        db.ExecuteNonQuery(dbCommanddetail, _transaction);
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
