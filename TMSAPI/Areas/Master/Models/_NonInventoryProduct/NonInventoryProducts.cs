using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class NonInventoryProducts
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public int NonInventoryProductId { get; set; }
        [DataMember(Order = 1)]
        public string NonInventoryProductName { get; set; }
        [DataMember(Order = 2)]
        public string UOMName { get; set; }
        [DataMember(Order = 3)]
        public decimal PurchasePrice { get; set; }
        [DataMember(Order = 4)]
        public bool IsActive { get; set; }

        public short UOMId { get; set; }
        #endregion

        #region constructor
        public NonInventoryProducts()
        {
        }

        public NonInventoryProducts(int _nipId, string _NonInventoryProductName, short _uomid, string  _uomName, decimal _unitPrice, bool _isActive)
        {
            NonInventoryProductId = _nipId;
            NonInventoryProductName = _NonInventoryProductName;
            UOMName = _uomName;
            UOMId = _uomid;
            PurchasePrice = _unitPrice;
            IsActive = _isActive;
        }

        public NonInventoryProducts(int productId, string _NonInventoryProductName)
        {
            NonInventoryProductId = productId;
            NonInventoryProductName = _NonInventoryProductName;
        }
        #endregion

        #region internal methods
        internal static List<NonInventoryProducts> Get(bool _activeOnly=true)
        {
            List<NonInventoryProducts> products = new List<NonInventoryProducts>();

            DbCommand dbCommand = db.GetStoredProcCommand("GetNonInventoryProducts");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        NonInventoryProducts p = new NonInventoryProducts(Convert.ToInt32(dr["NonInventoryProductId"]),
                                      dr["NonInventoryProductName"].ToString(),
                                          Convert.ToInt16(dr["UoMId"]),
                                      dr["UOMName"].ToString(),
                                          Convert.ToDecimal(dr["PurchasePrice"]),
                                          Convert.ToBoolean(dr["IsActive"]));
                        products.Add(p);
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
