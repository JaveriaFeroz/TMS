using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class SubContractors
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short SubContractorId { get; set; }
        [DataMember(Order = 1)]
        public string SubContractorName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region construcotr
        public SubContractors()
        {
        }
        #endregion

        #region internal methods
        internal static List<SubContractors> Get(bool _activeOnly = true)
        {
            List<SubContractors> sc = new List<SubContractors>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSubcontractors"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            sc.Add(new SubContractors
                            {
                                SubContractorId = Convert.ToInt16(dr["SubcontractorId"]),
                                SubContractorName = dr["SubContractorName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return sc;
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
