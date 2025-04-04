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
    public class Companies : IDisposable
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
        public Companies()
        {

        }
        #endregion

        #region internal methods
        internal static List<Companies> Get(string userid, bool _activeOnly = true)
        {
            try
            {
                List<Companies> companies = new List<Companies>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("getCompanies"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userid);
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                companies.Add(new Companies
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
            catch (Exception) { throw; }
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