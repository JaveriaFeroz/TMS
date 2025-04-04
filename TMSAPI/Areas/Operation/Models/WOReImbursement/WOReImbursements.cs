using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOReImbursements
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RequestId { get; set; }
        public string PeriodFromName { get; set; }
        public string PeriodToName { get; set; }
        public string BranchName { get; set; }
        public string SupplierName { get; set; }
        public string LeaseTypeName { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public WOReImbursements()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOReImbursements> Get(short companyId, string userId)
        {
            List<WOReImbursements> workorders = new List<WOReImbursements>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOReImbursements"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            workorders.Add(new WOReImbursements
                            {
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                PeriodFromName = dr["PeriodFromName"].ToString(),
                                PeriodToName = dr["PeriodToName"].ToString(),
                                BranchName = dr["BranchName"].ToString(),
                                SupplierName = dr["SupplierName"].ToString(),
                                LeaseTypeName = dr["LeaseTypeName"].ToString(),
                                StateName = dr["StateName"].ToString()
                            });
                        }
                    }
                }
            }
            return workorders;
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