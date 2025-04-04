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
    public class Cities 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short CityId { get; set; }
        [DataMember(Order = 1)]
        public string CityCode { get; set; }
        [DataMember(Order = 2)]
        public string CityName { get; set; }
        [DataMember(Order = 3)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Cities()
        {

        }
        #endregion

        #region internal methods
        internal static List<Cities> Get(bool _activeOnly = true)
        {
            List<Cities> cities = new List<Cities>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCities"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            cities.Add(new Cities
                            {
                                CityId = Convert.ToInt16(dr["CityId"]),
                                CityCode = dr["CityCode"].ToString(),
                                CityName = dr["CityName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return cities;
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