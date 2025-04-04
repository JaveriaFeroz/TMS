using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class AssetSwap : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? FromAssetId { get; set; }
        public int? FromDriverId1 { get; set; }
        public int? FromDriverId2 { get; set; }
        public int? FromTrailerId { get; set; }
        public string FromTrailerName { get; set; }

        public int? ToAssetId { get; set; }
        public int? ToDriverId1 { get; set; }
        public int? ToDriverId2 { get; set; }
        public int? ToTrailerId { get; set; }
        public string ToTrailerName { get; set; }
        #endregion

        #region constructor
        public AssetSwap()
        {
 
        }
        #endregion

        #region internal methods
        internal static bool Save(AssetSwap swap, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SwapAsset"))
                {
                    db.AddInParameter(dbCommand, "FromAssetId", SqlDbType.SmallInt, swap.FromAssetId);
                    db.AddInParameter(dbCommand, "FromTrailerId", SqlDbType.SmallInt, swap.FromTrailerId);
                    db.AddInParameter(dbCommand, "FromDriverId1", SqlDbType.SmallInt, swap.FromDriverId1);
                    db.AddInParameter(dbCommand, "FromDriverId2", SqlDbType.SmallInt, swap.FromDriverId2);
                    db.AddInParameter(dbCommand, "ToAssetId", SqlDbType.SmallInt, swap.ToAssetId);
                    db.AddInParameter(dbCommand, "ToTrailerId", SqlDbType.SmallInt, swap.ToTrailerId);
                    db.AddInParameter(dbCommand, "ToDriverId1", SqlDbType.SmallInt, swap.ToDriverId1);
                    db.AddInParameter(dbCommand, "ToDriverId2", SqlDbType.SmallInt, swap.ToDriverId2);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);                   
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception) { throw; }
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