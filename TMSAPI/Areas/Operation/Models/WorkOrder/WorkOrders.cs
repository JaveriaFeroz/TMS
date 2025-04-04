using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class WorkOrders 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string WONo { get; set; }
        public string WODate { get; set; }
        public string AssetNo { get; set; }
        public string PriorityName { get; set; }
        public int RequestId { get; set; }
        public string BranchName { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public WorkOrders()
        {
        }
        #endregion

        #region internal methods
        internal static List<WorkOrders> Get(short companyId, string userId)
        {
            List<WorkOrders> workorders = new List<WorkOrders>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWorkOrders"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            workorders.Add(new WorkOrders
                            {
                                WONo = dr["WONo"].ToString(),
                                WODate = dr["WODate"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                PriorityName = dr["PriorityName"].ToString(),
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                BranchName = dr["BranchName"].ToString(),
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