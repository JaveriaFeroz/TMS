using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string RwbNo { get; set; }       
        public string JobNo { get; set; }       
        public string RWBDate { get; set; }      
        public string ClientName { get; set; }   
        public string StateName { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public RWBs()
        {
        }
        #endregion

        #region internal methods
        internal static List<RWBs> Get(short companyId)
        {
            List<RWBs> rwbs = new List<RWBs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rwbs.Add(new RWBs
                            {
                                RwbNo = dr["RwbNo"].ToString(),
                                JobNo = dr["JobNo"].ToString(),
                                RWBDate = dr["RWBDate"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return rwbs;
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