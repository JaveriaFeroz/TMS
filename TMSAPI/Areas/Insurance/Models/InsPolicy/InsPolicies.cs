using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsPolicies 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int PolicyId { get; set; }
        public string PolicyNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string InsuranceCompanyName { get; set; }
        #endregion

        #region constructor
        public InsPolicies()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsPolicies> Get(short companyId, string userId, bool activeOnly=true)
        {
            List<InsPolicies> policies = new List<InsPolicies>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsPolicies"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            policies.Add(new InsPolicies
                            {
                                PolicyId = Convert.ToInt32(dr["PolicyId"]),
                                PolicyNo = dr["PolicyNo"].ToString(),
                                FromDate = dr["FromDate"].ToString(),
                                ToDate = dr["ToDate"].ToString(),
                                InsuranceCompanyName = dr["InsuranceCompanyName"].ToString()
                            });
                        }
                    }
                }
            }
            return policies;
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
