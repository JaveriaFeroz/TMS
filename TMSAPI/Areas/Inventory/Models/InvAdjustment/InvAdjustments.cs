using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvAdjustments : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int AdjId { get; set; }
        public string AdjDate { get; set; }
        public string BranchName { get; set; }
        //public string DepartmentName { get; set; }
        #endregion

        #region constructor
        public InvAdjustments()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvAdjustments> Get(short companyId, string userId)
        {
            List<InvAdjustments> adjustments = new List<InvAdjustments>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvAdjustments"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            adjustments.Add(new InvAdjustments
                            {
                                AdjId = Convert.ToInt32(dr["AdjId"]),
                                AdjDate = dr["AdjDate"].ToString(),
                                BranchName = dr["BranchName"].ToString()//,dr["DepartmentName"].ToString()
                            });
                        }
                    }
                }
            }
            return adjustments;
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
