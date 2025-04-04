using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class Shortage : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public double? Qty { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        public string Description { get; set; }
        #endregion

        #region constructor
        public Shortage()
        {
        
        }
        #endregion

        #region internal methods
        internal static Shortage Get(int rwbId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetShortageByNo"))
            {
                db.AddInParameter(dbCommand, "RwbId", SqlDbType.VarChar, rwbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Shortage
                        {
                            Qty = Convert.ToDouble(dr["Qty"]),
                            Rate = Convert.ToDouble(dr["Rate"]),
                            Amount = Convert.ToDouble(dr["Amount"]),
                            Description = dr["Description"].ToString()
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(int rwbId, decimal qty, decimal rate, string description, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveShortage"))
                {
                    db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "Qty", SqlDbType.Decimal, qty);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, rate);
                    db.AddInParameter(dbCommand, "Description", SqlDbType.VarChar, description);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}