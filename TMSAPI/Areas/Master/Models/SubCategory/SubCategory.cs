using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SubCategory : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public SubCategory()
        {
        }
        #endregion

        #region internal methods
        internal static SubCategory Get(short scId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSubCategoryById"))
            {
                db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, scId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new SubCategory
                        {
                            SubCategoryId = scId,
                            SubCategoryName = dr["SubCategoryName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(SubCategory sc, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSubCategory"))
                {
                    db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, sc.SubCategoryId);
                    db.AddInParameter(dbCommand, "SubCategoryName", SqlDbType.VarChar, sc.SubCategoryName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, sc.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, sc.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
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