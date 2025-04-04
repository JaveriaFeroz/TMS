using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOInventory
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
        public WOInventory()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOInventory> Get(int woId)
        {
            List<WOInventory> inventories = new List<WOInventory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOInventoriesById"))
            {
                db.AddInParameter(dbCommand, "WOId", SqlDbType.VarChar, woId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            inventories.Add(new WOInventory
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                Quantity = Convert.ToInt16(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString(),
                                Price = Convert.ToDouble(dr["Price"]),
                                Remarks = dr["Remarks"].ToString()
                            });
                        }
                    }
                }
            }
            return inventories;
        }

        internal static bool Save(int woId, List<WOInventory> details, string userId, DbTransaction transaction)
        {
            foreach (WOInventory woi in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOInventory"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, woi.DetailId);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, woi.ProductId);
                    db.AddInParameter(dbCommand, "Quantity", SqlDbType.SmallInt, woi.Quantity);
                    db.AddInParameter(dbCommand, "UOMId", SqlDbType.SmallInt, woi.UoMId);
                    db.AddInParameter(dbCommand, "Price", SqlDbType.Float, woi.Price);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, woi.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          woi.Delete ? "D" : (woi.Add ? "I" : "U")));                    
                    db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    woi.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                }
            }
            return true;
        }
        #endregion
    }
}