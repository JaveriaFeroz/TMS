using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBCharge
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? ChargeId { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public bool Locked { get; set; } = false;
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public RWBCharge()
        {
        }
        #endregion

        #region internal methods
        internal static List<RWBCharge> Get(int rwbId)
        {
            List<RWBCharge> charges = new List<RWBCharge>();
            //GetRWBOtherChargesByRWBId
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBChargesById"))
            {
                db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            charges.Add(new RWBCharge
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                Description = dr["Description"].ToString(),
                                Locked = Convert.ToBoolean(dr["Locked"]),
                                Amount = Convert.ToDecimal(dr["Amount"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return charges;
        }

        internal static bool Save(int rwbId, List<RWBCharge> details, string userId, DbTransaction transaction)
        {
            foreach (RWBCharge rc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBCharge"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, rc.DetailId);
                    db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, rc.ChargeId);
                    db.AddInParameter(dbCommand, "Description", SqlDbType.VarChar, rc.Description);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, rc.Amount);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          rc.Delete ? "D" : (rc.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}