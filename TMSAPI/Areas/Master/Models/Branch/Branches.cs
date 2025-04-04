using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class Branches
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short BranchId{ get; set; }
        public string BranchName { get; set; }
        #endregion

        #region constructor
        public Branches()
        {
        }
        #endregion

        #region internal methods
        internal static List<Branches> Get(bool activeOnly = true)
        {
            List<Branches> branches = new List<Branches>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetAllBranches");
            //db.AddInParameter(dbCommand, "MaintBranch", SqlDbType.Bit, maintBranchOnly);
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        branches.Add(new Branches
                        {
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            BranchName = dr["BranchName"].ToString()
                        });
                    }
                }
            }
            return branches;
        }

        internal static List<Branches> Get(string userid, bool activeOnly = true)
        {
            List<Branches> branches = new List<Branches>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetBranches");
            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userid);
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        branches.Add(new Branches
                        {
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            BranchName = dr["BranchName"].ToString()
                        });
                    }
                }
            }
            return branches;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}
