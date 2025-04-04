using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOEstInventory
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? ProductId { get; set; }
        public short Quantity { get; set; }
        public short UoMId { get; set; }
        public string UoMName { get; set; }
        public double Price { get; set; }
        public string Remarks { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public WOEstInventory()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOEstInventory> Get(int woId)
        {
            List<WOEstInventory> inventories = new List<WOEstInventory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOEstInventoryById"))
            {
                db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            inventories.Add(new WOEstInventory
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                Quantity = Convert.ToInt16(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString(),
                                Price = Convert.ToDouble(dr["Price"]),
                                Remarks = dr["Remarks"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return inventories;
        }

        internal static bool Save(int? woId, List<WOEstInventory> details, string userId, DbTransaction transaction)
        {
            foreach (WOEstInventory woei in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOEstInventory"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, woei.DetailId);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, woei.ProductId);
                    db.AddInParameter(dbCommand, "Quantity", SqlDbType.SmallInt, woei.Quantity);
                    db.AddInParameter(dbCommand, "UoMId", SqlDbType.TinyInt, woei.UoMId);
                    db.AddInParameter(dbCommand, "Price", SqlDbType.Float, woei.Price);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, woei.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                         woei.Delete ? "D" : (woei.Add ? "I" : "U")));
                    db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    woei.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                }
            }
            return true;
        }
        #endregion
    }
}