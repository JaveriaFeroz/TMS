using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class WHTaxExemptions
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short ExemptionId { get; set; }
        [DataMember(Order = 1)]
        public DateTime DateFrom { get; set; }
        [DataMember(Order = 2)]
        public DateTime DateTo { get; set; }
        #endregion

        #region constructor
        public WHTaxExemptions()
        {
        }
        #endregion

        #region internal methods
        internal static List<WHTaxExemptions> Get(short companyId)
        {
            List<WHTaxExemptions> exemptions = new List<WHTaxExemptions>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWHTaxExemptions"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                   
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            exemptions.Add(new WHTaxExemptions
                            {
                                ExemptionId = Convert.ToInt16(dr["WHTExemptionId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"])
                            });
                        }
                    }
                }
            }
            return exemptions;
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