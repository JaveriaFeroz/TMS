using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class GeoFences
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public int FenceId { get; set; }
        [DataMember(Order = 1)]
        public string FenceName { get; set; }
        [DataMember(Order = 2)]
        public string CityName { get; set; }
        [DataMember(Order = 3)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public GeoFences()
        {
        }
        #endregion

        #region internal methods
        internal static List<GeoFences> Get(short companyId, bool _activeOnly = true)
        {
            List<GeoFences> geofences = new List<GeoFences>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGeoFences"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            geofences.Add(new GeoFences
                            {
                                FenceId = Convert.ToInt32(dr["FenceId"]),
                                FenceName = dr["FenceName"].ToString(),
                                CityName = dr["CityName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return geofences;
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
