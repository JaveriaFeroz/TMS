using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvAdjustmentDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ProductId { get; set; }
        public decimal Quantity { get; set; }
        public short UoMId { get; set; }
        public string UoMName { get; set; }
        //to be further reviewed if we need to keep price here
        public decimal Price { get; set; }
        public string Reason { get; set; }
        //public bool Add { get; set; }
        //public bool Edit { get; set; }
        //public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InvAdjustmentDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvAdjustmentDetail> Get(int adjId)
        {
            List<InvAdjustmentDetail> details = new List<InvAdjustmentDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvAdjDetailById"))
            {
                db.AddInParameter(dbCommand, "AdjId", SqlDbType.Int, adjId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new InvAdjustmentDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                Quantity = Convert.ToDecimal(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UOMName"].ToString(),
                                Price = Convert.ToDecimal(dr["Price"]),
                                Reason = dr["Reason"].ToString()
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int adjId, List<InvAdjustmentDetail> details, string userId, DbTransaction transaction)
        {
            foreach (InvAdjustmentDetail iad in details)
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvAdjDetail"))
                {
                    db.AddInParameter(dbCommand, "AdjId", SqlDbType.Int, adjId);
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.Int, iad.ProductId);
                    db.AddInParameter(dbCommand, "Quantity", SqlDbType.Float, iad.Quantity);
                    db.AddInParameter(dbCommand, "UoMId", SqlDbType.Int, iad.UoMId);
                    db.AddInParameter(dbCommand, "Reason", SqlDbType.VarChar, iad.Reason);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}