using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class SubCategories
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public SubCategories()
        {
        }
        #endregion

        #region internal methods
        internal static List<SubCategories> Get(bool _activeOnly = true)
        {
            List<SubCategories> sc = new List<SubCategories>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSubCategorys"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            sc.Add(new SubCategories
                            {
                                SubCategoryId = Convert.ToInt16(dr["SubCategoryId"]),
                                SubCategoryName = dr["SubCategoryName"].ToString(),
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