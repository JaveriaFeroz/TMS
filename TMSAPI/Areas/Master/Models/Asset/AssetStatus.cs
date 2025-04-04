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
    public class AssetStatus
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public property
        [DataMember (Order=0)]
        public short StatusId { get; set; }
        [DataMember(Order = 1)]
        public string StatusName { get; set; }
        [DataMember(Order = 2)]
        public bool Editable { get; set; }
        #endregion

        #region constructor
        public AssetStatus()
        {
        }
        #endregion

        #region internal methods
        internal static List<AssetStatus> Get(bool _activeOnly = true)
        {
            List<AssetStatus> statuses = new List<AssetStatus>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetStatuses"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            statuses.Add(new AssetStatus
                            {
                                StatusId = Convert.ToInt16(dr["StatusId"]),
                                StatusName = dr["StatusName"].ToString(),
                                Editable = Convert.ToBoolean(dr["Editable"])
                            });
                        }
                    }
                    return statuses;
                }
            }
        }
        #endregion
    }
}
