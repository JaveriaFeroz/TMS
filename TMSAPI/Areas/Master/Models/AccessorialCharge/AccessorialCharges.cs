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
    public class AccessorialCharges
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ChargeId { get; set; }
        public string ChargeName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public AccessorialCharges()
        {}
        #endregion

        #region internal methods
        internal static List<AccessorialCharges> Get(bool _activeOnly = true)
        {
            List<AccessorialCharges> charges = new List<AccessorialCharges>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialCharges"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            charges.Add(new AccessorialCharges
                            {
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                ChargeName = dr["ChargeName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return charges;
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
