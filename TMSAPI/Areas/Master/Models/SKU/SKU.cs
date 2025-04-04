using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SKU : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SKUId { get; set; }
        public string SKUName { get; set; }
        public short? SKUTypeId { get; set; }
        public bool IsActive { get; set; }
        public List<SKUClient> Details { get; set; } = new List<SKUClient>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public SKU()
        {
            
        }
        #endregion

        #region internal methods
        internal static SKU Get(short id, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSKUById"))
            {
                db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, id);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new SKU
                        {
                            SKUId = id,
                            SKUName = dr["SKUName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            SKUTypeId = agHelper.sDBNull(dr["SKUTypeId"]),
                            Footer = new agFooter(dr),
                            Details = SKUClient.Get(id)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(SKU sku, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSKU"))
                    {
                        db.AddInParameter(dbCommand, "SKUId", SqlDbType.SmallInt, sku.SKUId);
                        db.AddInParameter(dbCommand, "SKUName", SqlDbType.VarChar, sku.SKUName);
                        db.AddInParameter(dbCommand, "SKUTypeId", SqlDbType.SmallInt, sku.SKUTypeId);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                        db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, sku.IsActive);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, sku.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newSKUId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);

                        sku.SKUId = Convert.ToInt16(dbCommand.Parameters["@newSKUId"].Value);

                        SKUClient.Save(sku.SKUId, sku.Details, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception) { transaction.Rollback(); throw; }
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