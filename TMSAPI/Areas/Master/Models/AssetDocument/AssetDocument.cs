using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using TMSAPI.Helper;
using TMSAPI.Areas.Master.Models.AD;

namespace TMSAPI.Areas.Master.Models
{
    public class AssetDocument : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? AssetId { get; set; }
        public List<Documents> Details { get; set; } = new List<Documents>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public AssetDocument()
        {
            
        }
        #endregion

        #region internal methods
        internal static AssetDocument Get(short assetId, short companyId)
        {
            try
            {
                using (AssetDocument _ad = new AssetDocument())
                {
                    _ad.AssetId = assetId;
                    _ad.Details = Documents.Get(assetId, companyId);
                    return _ad;
                }
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Save(AssetDocument ad, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction _transaction = dbconnection.BeginTransaction();
                try
                {
                    Documents.Save(ad.AssetId, ad.Details, userId, _transaction);
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

        #region disposal
        public void Dispose()
        {
        }
        #endregion
    }
}