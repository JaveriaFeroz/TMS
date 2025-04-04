using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class ProductType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ProductType()
        {
        }
        #endregion

        #region internal methods
        internal static ProductType Get(short typeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetProductTypeById"))
            {
                db.AddInParameter(dbCommand, "ProductTypeId", SqlDbType.SmallInt, typeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new ProductType
                        {
                            TypeId = Convert.ToInt16(dr["ProductTypeId"]),
                            TypeName = dr["ProductTypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ProductType pt, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveProductType"))
                {
                    db.AddInParameter(dbCommand, "ProductTypeId", SqlDbType.SmallInt, pt.TypeId);
                    db.AddInParameter(dbCommand, "ProductTypeName", SqlDbType.VarChar, pt.TypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, pt.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, pt.Footer.UpdatedOn);
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