using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Models
{
    public class GRNs : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string  GRNNo { get; set; }
        public string GRNDate { get; set; }
        public int? PONo { get; set; }
        public string BranchName { get; set; }
        public string SupplierName { get; set; }
        #endregion

        #region constructor
        public GRNs()
        {
        }
        #endregion

        #region internal methods
        internal static List<GRNs> Get(short companyId, string userId)
        {
            try
            {
                List<GRNs> grns = new List<GRNs>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetGRNs"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                grns.Add(new GRNs
                                {
                                    GRNNo = dr["GRNNo"].ToString(),
                                    GRNDate = dr["GRNDate"].ToString(),
                                    PONo = agHelper.iDBNull(dr["PONo"]),
                                    BranchName = dr["BranchName"].ToString(),
                                    SupplierName = dr["SupplierName"].ToString()
                                });
                            }
                        }
                    }
                }
                return grns;
            }
            catch (Exception) { throw; }
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
