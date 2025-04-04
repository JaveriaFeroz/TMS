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
    public class MaintenanceCharges
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ChargeId { get; set; }
        public string ChargeName { get; set; }
        #endregion

        #region constructor
        public MaintenanceCharges()
        {
        }
        #endregion

        #region internal methods
        internal static List<MaintenanceCharges> Get(bool _activeOnly = true)
        {
            List<MaintenanceCharges> capacities = new List<MaintenanceCharges>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetMaintenanceCharges"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            capacities.Add(new MaintenanceCharges
                            {
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                ChargeName = dr["ChargeName"].ToString()
                            });
                        }
                    }
                }
            }
            return capacities;
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