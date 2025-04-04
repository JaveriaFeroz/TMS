using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Categories
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short CategoryId { get; set; }
        [DataMember(Order = 1)]
        public string CategoryName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        [Browsable(false)]
        public short ClientId { get; set; }
        #endregion

        #region constructor
        public Categories()
        {
        }
        #endregion

        #region internal methods
        internal static List<Categories> Get(short companyId, bool _activeOnly = true)
        {
            List<Categories> category = new List<Categories>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetSKUCategories");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        category.Add(new Categories
                        {
                            CategoryId = Convert.ToInt16(dr["CategoryId"]),
                            CategoryName = dr["CategoryName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return category;
        }

        internal static List<Categories> GetWithClients(short companyId)
        {
            List<Categories> category = new List<Categories>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetSKUCategoriesWithClient");
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        category.Add(new Categories
                        {
                            CategoryId = Convert.ToInt16(dr["CategoryId"]),
                            CategoryName = dr["CategoryName"].ToString(),
                            ClientId = Convert.ToInt16(dr["ClientId"])
                        });
                    }
                }
            }
            return category;
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
