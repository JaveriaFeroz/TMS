using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class VehicleGroups
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short GroupId { get; set; }
        [DataMember(Order = 1)]
        public string GroupName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public VehicleGroups()
        {
        }
        #endregion

        #region internal methods
        internal static List<VehicleGroups> Get(bool _activeOnly = true)
        {
            List<VehicleGroups> vehiclegroups = new List<VehicleGroups>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetVehicleGroups"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            vehiclegroups.Add(new VehicleGroups
                            {
                                GroupId = Convert.ToInt16(dr["GroupId"]),
                                GroupName = dr["GroupName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return vehiclegroups;
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