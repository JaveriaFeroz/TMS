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
    public class Capacities 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short CapacityId { get; set; }
        public string CapacityName { get; set; }
        #endregion

        #region constructor
        public Capacities()
        {
        }
        #endregion

        #region internal methods
        internal static List<Capacities> Get(bool _activeOnly = true)
        {
            List<Capacities> capacities = new List<Capacities>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCapacities"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            capacities.Add(new Capacities
                            {
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                CapacityName = dr["CapacityName"].ToString()
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