using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Inventory.Models
{
    public class GRNDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ProductId { get; set; }
        public short UoMId { get; set; }
        public string ProductName { get; set; }
        public string UoMName { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal GSTRate { get; set; }
        public decimal DiscRate { get; set; }
        public string Narration { get; set; }
        #endregion

        #region constructor
        public GRNDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<GRNDetail> Get(int grnId)
        {
            List<GRNDetail> details = new List<GRNDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGRNDetailById"))
            {
                db.AddInParameter(dbCommand, "GRNId", SqlDbType.Int, grnId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new GRNDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                ProductName = dr["ProductName"].ToString(),
                                Quantity = Convert.ToDecimal(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString(),
                                Price = Convert.ToDecimal(dr["Price"]),
                                GSTRate = Convert.ToDecimal(dr["GSTRate"]),
                                //              VATRate=                      Convert.ToDouble(dr["VATRate"]),
                                DiscRate = Convert.ToDecimal(dr["DiscRate"]),
                                Narration = dr["Narration"].ToString()
                            });
                        }
                    }
                }
            }
            return details;
        }

        //internal static List<GRNDetail> GetFromPO(int poNo)
        internal static GRN GetFromPO(int poNo, short companyId, string userId)
        {
            GRN grn = new GRN();
            List<GRNDetail> details = new List<GRNDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPOByNo"))
            {
                db.AddInParameter(dbCommand, "PONo", SqlDbType.Int, poNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        grn.BranchId = Convert.ToInt16(dr["BranchId"]);
                        grn.SupplierId = Convert.ToInt16(dr["SupplierId"]);
                    }
                }
            }
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPODetailForGRNByNo"))
            {
                db.AddInParameter(dbCommand, "PONo", SqlDbType.Int, poNo);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new GRNDetail
                            {
                                ProductId = Convert.ToInt16(dr["ProductId"]),
                                ProductName = dr["ProductName"].ToString(),
                                Quantity = Convert.ToDecimal(dr["Quantity"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString(),
                                Price = Convert.ToDecimal(dr["Price"]),
                                GSTRate = Convert.ToDecimal(dr["GSTRate"]),
                                DiscRate = Convert.ToDecimal(dr["DiscRate"])
                            });
                        }
                    }
                }
            }
            grn.Details = details;
            return grn;
        }

        internal static bool Save(int grnId, List<GRNDetail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (GRNDetail grd in details)
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGRNDetail"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, grd.DetailId);
                        db.AddInParameter(dbCommand, "GRNId", SqlDbType.Int, grnId);
                        db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, grd.ProductId);
                        db.AddInParameter(dbCommand, "Quantity", SqlDbType.Float, grd.Quantity);
                        db.AddInParameter(dbCommand, "UoMId", SqlDbType.SmallInt, grd.UoMId);
                        db.AddInParameter(dbCommand, "Price", SqlDbType.Float, grd.Price);
                        db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Float, grd.GSTRate);
                        db.AddInParameter(dbCommand, "DiscRate", SqlDbType.Float, grd.DiscRate);
                        db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, grd.Narration);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
            }
            catch(Exception ex) { throw ex; }
            return true;
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
