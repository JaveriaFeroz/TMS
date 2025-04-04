using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class Jobs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string JobNo { get; set; }
        public string JobDate { get; set; }
        public string StartDate { get; set; }
        public string StateName { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public Jobs()
        {

        }
        #endregion

        #region internal methods
        internal static List<Jobs> Get(short companyId)
        {
            List<Jobs> jobs = new List<Jobs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJobs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            jobs.Add(new Jobs
                            {
                                JobNo = dr["JobNo"].ToString(),
                                JobDate = dr["JobDate"].ToString(),
                                StartDate = dr["JobStartDate"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return jobs;
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
