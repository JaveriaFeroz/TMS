using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Product : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ProductId { get; set; }
        public string ProductName { get; set; }
        public double PurchasePrice { get; set; }
        //public short UoMId { get; set; }
        public short? ProductTypeId { get; set; }
        //public short ProductNatureId { get; set; }
        public string UoMName { get; set; }
        public string ProductNatureName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion
       
        #region constructor
        public Product()
        {
        }
        #endregion

        #region internal methods
        internal static Product Get(short _productId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetProductById"))
            {
                db.AddInParameter(dbCommand, "productId", SqlDbType.SmallInt, _productId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Product
                        {
                            ProductId = _productId,
                            ProductName = dr["ProductName"].ToString(),
                            PurchasePrice = Convert.ToDouble(dr["PurchasePrice"]),
                            //UoMId = Convert.ToInt16(dr["UomId"]),
                            UoMName = dr["UoMName"].ToString(),
                            ProductTypeId = agHelper.sDBNull(dr["ProductTypeId"]),
                            //ProductNatureId = Convert.ToInt16(dr["ProductNatureId"]),
                            ProductNatureName = dr["ProductNatureName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Product product, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveProduct"))
                {
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.Int, product.ProductId);
                    db.AddInParameter(dbCommand, "ProductTypeId", SqlDbType.SmallInt, product.ProductTypeId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, product.Footer.UpdatedOn);
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
            //
        }
        #endregion
    }  
}