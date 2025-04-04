using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Drivers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public int DriverId { get; set; }
        [DataMember(Order = 1)]
        public string DriverName { get; set; }
        [DataMember(Order = 2)]
        public string PrimeMover { get; set; }
        [DataMember(Order = 3)]
        public string CNIC { get; set; }
        [DataMember(Order = 4)]
        public string Branch { get; set; }
        [DataMember(Order = 5)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Drivers()
        {
        }
        #endregion

        #region internal methods
        internal static List<Drivers> Get(short companyId, bool _activeOnly = true)
        {
            List<Drivers> drivers = new List<Drivers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDrivers"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            drivers.Add(new Drivers
                            {
                                DriverId = Convert.ToInt32(dr["DriverId"]),
                                DriverName = dr["DriverName"].ToString(),
                                PrimeMover = dr["AssetNo"].ToString(),
                                CNIC = dr["CNIC"].ToString(),
                                Branch = dr["BranchName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return drivers;
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