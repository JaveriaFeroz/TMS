using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    public class SKUs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int SKUId { get; set; }
        public string SKUName { get; set; }
        public bool IsActive { get; set; }
        public short ClientId { get; set; }
        #endregion

        #region constructor
        public SKUs()
        {
        }
        #endregion

        #region internal methods
        internal static List<SKUs> Get(short companyId, bool activeOnly = true)
        {
            List<SKUs> skus = new List<SKUs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSKUs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            skus.Add(new SKUs
                            {
                                SKUId = Convert.ToInt32(dr["SKUId"]),
                                SKUName = dr["SKUName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
                return skus;
            }
        }

        internal static List<SKUs> GetWithClients(short companyId)
        {
            List<SKUs> skus = new List<SKUs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSKUsWithClients"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            skus.Add(new SKUs
                            {
                                SKUId = Convert.ToInt32(dr["SKUId"]),
                                SKUName = dr["SKUName"].ToString(),
                                ClientId = Convert.ToInt16(dr["ClientId"])
                            });
                        }
                    }
                }
            }
            return skus;
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