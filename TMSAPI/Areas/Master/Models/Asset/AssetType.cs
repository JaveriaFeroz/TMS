using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class AssetType
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public property
        [DataMember (Order=0)]
        public short TypeId { get; set; }
        [DataMember(Order = 1)]
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public AssetType()
        {
        }
        #endregion

        #region internal methods
        internal static List<AssetType> Get(bool _activeOnly = true)
        {
            List<AssetType> types = new List<AssetType>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetTypes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new AssetType
                            {
                                TypeId = Convert.ToInt16(dr["AssetTypeId"]),
                                TypeName = dr["AssetTypeName"].ToString()
                            });
                        }
                    }
                    return types;
                }
            }
        }
        #endregion
    }
}
