using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Inventory.Models
{
    [DataContract]
    public class PurchaseOrders
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int PONo { get; set; }
        public DateTime PODate { get; set; }
        public string SupplierName { get; set; }
        public int PRNo { get; set; }
        public string BranchName { get; set; }
        #endregion

        #region constructore
        public PurchaseOrders()
        {
        }
        #endregion

        #region internal methods
        internal static List<PurchaseOrders> GetPOsForGRN(short companyId, string userId)
        {
            List<PurchaseOrders> pos = new List<PurchaseOrders>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPOsForGRN"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            pos.Add(new PurchaseOrders
                            {
                                PONo = Convert.ToInt32(dr["PONo"]),
                                PODate = Convert.ToDateTime(dr["PODate"]),
                                SupplierName = dr["SupplierName"].ToString(),
                                PRNo = Convert.ToInt32(dr["PRNo"]),
                                BranchName = dr["BranchName"].ToString()
                            });
                        }
                    }
                }
            }
            return pos;
        }
        #endregion
    }
}
