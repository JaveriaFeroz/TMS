using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Products
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ProductId { get; set; }
        public string ProductName { get; set; }
        public string  UOMName { get; set; }
        public double PurchasePrice { get; set; }
        public bool IsActive { get; set; }
        public short UOMId { get; set; }
        #endregion

        #region constructor
        public Products()
        {
        }
        #endregion

        #region internal methods
        internal static List<Products> Get(bool _activeonly=true)
        {
            List<Products> products = new List<Products>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetProducts");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeonly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        products.Add(new Products
                        {
                            ProductId = Convert.ToInt16(dr["ProductId"]),
                            ProductName = dr["ProductName"].ToString(),
                            UOMId = Convert.ToInt16(dr["UoMId"]),
                            UOMName = dr["UomName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            PurchasePrice = Convert.ToDouble(dr["PurchasePrice"])
                        });
                    }
                }
            }
            return products;
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
