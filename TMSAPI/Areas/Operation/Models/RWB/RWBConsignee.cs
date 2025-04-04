using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBConsignee
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? ConsigneeId { get; set; }
        public short? SKUId { get; set; }
        public double? Qty { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public RWBConsignee()
        {
        }
        #endregion

        #region internal methods
        internal static List<RWBConsignee> Get(int rwbId)
        {
            List<RWBConsignee> consignees = new List<RWBConsignee>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBConsigneesById"))
            {
                db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            consignees.Add(new RWBConsignee
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ConsigneeId = Convert.ToInt16(dr["ConsigneeId"]),
                                SKUId = Convert.ToInt16(dr["SKUId"]),
                                Qty = Convert.ToDouble(dr["Qty"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return consignees;
        }

        internal static bool Save(int rwbId, List<RWBConsignee> details, string userId, DbTransaction transaction)
        {
            foreach (RWBConsignee rc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBConsignee"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, rc.DetailId);
                    db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.SmallInt, rc.ConsigneeId);
                    db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, rc.SKUId);
                    db.AddInParameter(dbCommand, "Qty", SqlDbType.Decimal, rc.Qty);
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