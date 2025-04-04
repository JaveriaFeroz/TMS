using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class PMs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short PMId { get; set; }
        public string CapacityName { get; set; }
        public string AssetMakeName { get; set; }
        public string ActivityName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public PMs()
        {
        }
        #endregion

        #region internal methods
        internal static List<PMs> Get(short companyId, string userId, bool activeOnly = true)
        {
            List<PMs> pms = new List<PMs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPMs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            pms.Add(new PMs
                            {
                                PMId = Convert.ToInt16(dr["PMId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                AssetMakeName = dr["MakeName"].ToString(),
                                ActivityName = dr["ActivityName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return pms;
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