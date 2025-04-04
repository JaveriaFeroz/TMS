using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Finance.Models
{
    public class ExpReimbursements 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RequestId { get; set; }
        public string BranchName { get; set; }
        public string PeriodFromName { get; set; }
        public string PeriodToName { get; set; }
        #endregion

        #region constructor
        public ExpReimbursements()
        {
        }
        #endregion

        #region public functions
        internal static List<ExpReimbursements> Get(short companyId, string userId)
        {
            List<ExpReimbursements> reimbursements = new List<ExpReimbursements>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetExpReimbursements"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            reimbursements.Add(new ExpReimbursements
                            {
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                //StatusName = dr["StatusName"].ToString(),
                                BranchName = dr["BranchName"].ToString(),
                                PeriodFromName = dr["PeriodFrom"].ToString(),
                                PeriodToName = dr["PeriodTo"].ToString()
                            });
                        }
                    }
                }
            }
            return reimbursements;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}
