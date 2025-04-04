using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SKUClient
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ClientId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public SKUClient()
        {
        }
        #endregion

        #region internal methods
        internal static List<SKUClient> Get(short skuId)
        {
            List<SKUClient> skus = new List<SKUClient>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientsBySKU"))
            {
                db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, skuId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            skus.Add(new SKUClient
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ClientId = Convert.ToInt16(dr["ClientId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return skus;
        }

        internal static bool Save(short? skuId, List<SKUClient> details, string userId, DbTransaction transaction)
        {
            foreach (SKUClient sc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSKUClient"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, sc.DetailId);
                    db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, skuId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, sc.ClientId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               sc.Delete ? "D" : (sc.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}