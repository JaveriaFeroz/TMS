using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
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
        public bool IsActive { get; set; }
        public List<FMProductClient> Details { get; set; } = new List<FMProductClient>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Product()
        {
        }
        #endregion

        #region internal methods
        internal static Product Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFMProductById"))
            {
                db.AddInParameter(dbCommand, "ProductId", SqlDbType.Int, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        using (Product g = new Product())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            g.ProductId = id;
                            g.ProductName = dr["ProductName"].ToString();                           
                            g.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            g.Footer = new agFooter(dr);
                            g.Details = FMProductClient.Get(id);
                            return g;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Product _p, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();

                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFMProduct"))
                    {
                        db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, _p.ProductId);
                        db.AddInParameter(dbCommand, "ProductName", SqlDbType.VarChar, _p.ProductName);
                        db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _p.IsActive);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _p.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newProductId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);

                        _p.ProductId = Convert.ToInt16(dbCommand.Parameters["@newProductId"].Value);

                        FMProductClient.Save(_p.ProductId, _p.Details, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }
        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            //db = null;
        }

        #endregion
    }
}