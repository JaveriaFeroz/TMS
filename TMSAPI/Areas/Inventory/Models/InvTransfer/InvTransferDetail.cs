using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvTransferDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? ProductId { get; set; }
        public decimal Quantity { get; set; }
        public short UoMId { get; set; }
        public string UoMName { get; set; }
        public decimal Price { get; set; }
        //public bool Add { get; set; } = true;
        //public bool Edit { get; set; } = false;
        //public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InvTransferDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvTransferDetail> Get(int trfId)
        {
            List<InvTransferDetail> details = new List<InvTransferDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvTransferDetailById"))
            {
                db.AddInParameter(dbCommand, "TransferId", SqlDbType.Int, trfId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new InvTransferDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                Quantity = Convert.ToDecimal(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString(),
                                Price = Convert.ToDecimal(dr["Price"])
                                //Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int trfId, List<InvTransferDetail> details, string userId, DbTransaction transaction)
        {
            foreach (InvTransferDetail itd in details)
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvTransferDetail"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, itd.DetailId);
                    db.AddInParameter(dbCommand, "TransferId", SqlDbType.Int, trfId);
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.Int, itd.ProductId);
                    db.AddInParameter(dbCommand, "Quantity", SqlDbType.Float, itd.Quantity);
                    db.AddInParameter(dbCommand, "UoMId", SqlDbType.Int, itd.UoMId);
                    db.AddInParameter(dbCommand, "Price", SqlDbType.Float, itd.Price);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    //db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                    //     itd.Delete ? "D" : (itd.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
