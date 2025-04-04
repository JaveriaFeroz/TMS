using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    //this class to be made redundant later
    public class NonInventoryProduct : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? NonInventoryProductId { get; set; }
        public string NonInventoryProductName { get; set; }
        public short UOMId { get; set; }
        public short ProductTypeId { get; set; }
        //public short ProductNatureId { get; set; }
        public decimal UnitPrice { get; set; }

        public bool IsActive { get; set; }
        
       public agFooter Footer { get; set; }


        #endregion

        #region constructor
        public NonInventoryProduct()
        {
            Footer = new agFooter();
        }
        #endregion

        #region internal methods
        internal static NonInventoryProduct Get(int nipId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetNonInventoryProductById"))
            {
                db.AddInParameter(dbCommand, "NonInventoryProductId", SqlDbType.Int, nipId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        using (NonInventoryProduct nip = new NonInventoryProduct())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            nip.NonInventoryProductId = Convert.ToInt32(dr["NonInventoryProductId"]);
                            nip.NonInventoryProductName = dr["NonInventoryProductName"].ToString();
                            nip.ProductTypeId = Convert.ToInt16(dr["ProductTypeId"]);
                            nip.UOMId = Convert.ToInt16(dr["UOMId"]);
                            nip.UnitPrice = Convert.ToDecimal(dr["PurchasePrice"]);
                            nip.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            nip.Footer = new agFooter(dr);
                            return nip;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool SaveNonInventoryProduct(NonInventoryProduct nip, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveNonInventoryProduct"))
                {
                    db.AddInParameter(dbCommand, "NonInventoryProductId", SqlDbType.Int, nip.NonInventoryProductId);
                    db.AddInParameter(dbCommand, "NonInventoryProductName", SqlDbType.VarChar, nip.NonInventoryProductName);
                    db.AddInParameter(dbCommand, "PurchasePrice", SqlDbType.Decimal, nip.UnitPrice);
                    db.AddInParameter(dbCommand, "UoMId", SqlDbType.SmallInt, nip.UOMId);
                    db.AddInParameter(dbCommand, "ProductTypeId", SqlDbType.SmallInt, nip.ProductTypeId);
                    //db.AddInParameter(dbCommand, "ProductNatureId", SqlDbType.SmallInt, nonInventoryProduct.ProductNatureId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, nip.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, nip.Footer.UpdatedOn);
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