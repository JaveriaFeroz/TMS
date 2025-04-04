using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOEstOtherCharges
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId {get;set;}
        public short? ChargeId { get; set; }
        public short Quantity { get; set; }
        //public short? UoMId { get; set; }
        //public string UoMName { get; set; }
        public double Amount { get; set; }
        public string Remarks { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public WOEstOtherCharges()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOEstOtherCharges> Get(int woId)
        {
            List<WOEstOtherCharges> charges = new List<WOEstOtherCharges>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOEstOtherChgsById"))
            {
                db.AddInParameter(dbCommand, "WOId", SqlDbType.VarChar, woId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            charges.Add(new WOEstOtherCharges
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                Quantity = Convert.ToInt16(dr["Quantity"]),
                               // UoMId = Convert.ToInt16(dr["UoMId"]),
                                //UoMName = dr["UoMName"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Remarks = dr["Remarks"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return charges;
        }

        internal static bool Save(int woId, List<WOEstOtherCharges> details, string userId, DbTransaction transaction)
        {
            foreach (WOEstOtherCharges wooc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOEstOtherChgs"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, wooc.DetailId);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                    db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, wooc.ChargeId);
                    db.AddInParameter(dbCommand, "Quantity", SqlDbType.SmallInt, wooc.Quantity);
                   // db.AddInParameter(dbCommand, "UOMId", SqlDbType.TinyInt, wooc.UoMId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, wooc.Amount);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, wooc.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                            wooc.Delete ? "D" : (wooc.Add ? "I" : "U")));
                    db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    wooc.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                }
            }
            return true;
        }
        #endregion
    }
}
