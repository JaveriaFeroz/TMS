using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsCompanies : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short CompanyId { get; set; }
        public string CompanyName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public InsCompanies()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsCompanies> Get(bool _activeOnly=true)
        {
            List<InsCompanies> companies = new List<InsCompanies>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsCompanies"))
            {
                db.AddInParameter(dbCommand, "activeonly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            companies.Add(new InsCompanies
                            {
                                CompanyId = Convert.ToInt16(dr["CompanyId"]),
                                CompanyName = dr["CompanyName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return companies;
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
