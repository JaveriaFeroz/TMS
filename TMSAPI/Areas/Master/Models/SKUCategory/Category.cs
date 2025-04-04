using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Category : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? CategoryId { get; set; }
        public string CategoryName { get; set; } 
        public bool IsActive { get; set; }
        public List<CategoryClient> Details { get; set; } = new List<CategoryClient>();
        public agFooter Footer { get; set; } = new agFooter();       
        #endregion

        #region constructor
        public Category()
        {
        }
        #endregion

        #region internal methods
        internal static Category Get(short categoryId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSKUCategoryById"))
            {
                db.AddInParameter(dbCommand, "CategoryId", SqlDbType.SmallInt, categoryId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Category
                        {
                            CategoryId = categoryId,
                            CategoryName = dr["CategoryName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr),
                            Details = CategoryClient.Get(categoryId)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Category g, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSKUCategory"))
                {
                    db.AddInParameter(dbCommand, "CategoryId", SqlDbType.SmallInt, g.CategoryId);
                    db.AddInParameter(dbCommand, "CategoryName", SqlDbType.VarChar, g.CategoryName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, g.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, g.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newCategoryId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    g.CategoryId = Convert.ToInt16(dbCommand.Parameters["@newCategoryId"].Value);
                    CategoryClient.Save(g.CategoryId, g.Details, userId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception) { transaction.Rollback(); throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
        }
        #endregion
    }
}