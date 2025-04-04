using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SupplierRate : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SupplierId { get; set; }
        public List<SupplierRateDetail> Details { get; set; } = new List<SupplierRateDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public SupplierRate()
        {
        }
        #endregion

        #region internal methods
        internal static SupplierRate Get(short _supplierId)
        {
            try
            {
                return new SupplierRate
                {
                    SupplierId = _supplierId,
                    Details = SupplierRateDetail.Get(_supplierId)
                };
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Save(SupplierRate s, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction _transaction = dbconnection.BeginTransaction();
                try
                {
                    SupplierRateDetail.Save(s.SupplierId, s.Details, userId, _transaction);
                    _transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    _transaction.Rollback();
                    throw;
                }
            }
        }
        #endregion

        #region Idisposable
        public void Dispose()
        {
        }
        #endregion
    }
}