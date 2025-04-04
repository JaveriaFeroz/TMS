using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBSKU
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? SKUId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public RWBSKU()
        {
        }
        #endregion

        #region internal methods
        internal static List<RWBSKU> Get(int rwbId)
        {
            List<RWBSKU> skus = new List<RWBSKU>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBSKUsById"))
            {
                db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            skus.Add(new RWBSKU
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                SKUId = Convert.ToInt16(dr["SKUId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return skus;
        }

        internal static bool Save(int rwbId, List<RWBSKU> details, string userId, DbTransaction transaction)
        {
            foreach (RWBSKU rs in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBSKU"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, rs.DetailId);
                    db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, rs.SKUId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          rs.Delete ? "D" : (rs.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}