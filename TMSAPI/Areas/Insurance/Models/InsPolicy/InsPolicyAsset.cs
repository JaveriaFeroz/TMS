using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsPolicyAsset : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }       
        public int AssetId { get; set; }       
        public string Remarks { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InsPolicyAsset()
        {
        }
        #endregion        

        #region internal methods
        internal static List<InsPolicyAsset> Get(int policyId)
        {
            List<InsPolicyAsset> assets = new List<InsPolicyAsset>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsPolicyAssetsById"))
            {
                db.AddInParameter(dbCommand, "policyId", SqlDbType.Int, policyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new InsPolicyAsset
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                Remarks = dr["Remarks"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return assets;
        }

        internal static bool Save(short policyId, List<InsPolicyAsset> details, string userId, DbTransaction transaction)
        {
            foreach (InsPolicyAsset ipa in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsPolicyAsset"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, ipa.DetailId);
                    db.AddInParameter(dbCommand, "PolicyId", SqlDbType.SmallInt, policyId);
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.Int, ipa.AssetId);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, ipa.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                         ipa.Delete ? "D" : (ipa.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}