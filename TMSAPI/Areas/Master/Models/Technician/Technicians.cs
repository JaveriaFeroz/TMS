using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Technicians
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TechnicianId { get; set; }
        [DataMember(Order = 1)]
        public string TechnicianName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Technicians()
        {
        }
        #endregion

        #region internal methods
        internal static List<Technicians> Get(bool _activeOnly = true)
        {
            List<Technicians> technicians = new List<Technicians>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTechnicians"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            technicians.Add(new Technicians
                            {
                                TechnicianId = Convert.ToInt16(dr["TechnicianId"]),
                                TechnicianName = dr["TechnicianName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return technicians;
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
