using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class AssetTyre
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; } = -1;
        public short AssetId { get; set; }
        public string SerialNo { get; set; }
        public string Make { get; set; }
        public double StartKMs { get; set; }
        public bool IsActive { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public AssetTyre()
        {
        }
        #endregion

        #region internal methods
        internal static List<AssetTyre> Get(short assetid)
        {
            List<AssetTyre> tyres = new List<AssetTyre>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetTyresById"))
            {
                db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            tyres.Add(new AssetTyre
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                AssetId = assetid,
                                SerialNo = dr["SerialNo"].ToString(),
                                Make = dr["Make"].ToString(),
                                StartKMs = Convert.ToDouble(dr["StartKMs"]),
                                IsActive = Convert.ToBoolean(dr["IsActive"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return tyres;
        }

        internal static bool Save(short assetId, List<AssetTyre> details, string userId, DbTransaction transaction)
        {
            foreach (AssetTyre tyre in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAssetTyres"))
                {
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.BigInt, tyre.DetailId);
                    db.AddInParameter(dbCommand, "SerialNo", SqlDbType.VarChar, tyre.SerialNo);
                    db.AddInParameter(dbCommand, "Make", SqlDbType.VarChar, tyre.Make);
                    db.AddInParameter(dbCommand, "StartKMs", SqlDbType.Float, tyre.StartKMs);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, tyre.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               tyre.Delete ? "D" : (tyre.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
