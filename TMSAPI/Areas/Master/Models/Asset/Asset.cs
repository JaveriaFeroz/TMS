using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Asset : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? AssetId { get; set; }
        public string AssetNo { get; set; }
        public short? AssetTypeId { get; set; }
        public short? CapacityId { get; set; }
        public short? MakeId { get; set; }
        public string Model { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public short? LeaseTypeId { get; set; }
        public short? SupplierId { get; set; }
        public decimal StartKMs { get; set; }
        public decimal KMs { get; set; }
        public short? StatusId { get; set; }
        public short? DriverId1 { get; set; }
        public short? DriverId2 { get; set; }
        public short? TrailerId { get; set; }
        public string FACode { get; set; }
        public short CityId { get; set; }
        public short? ClientId { get; set; }
        public short? BaseId { get; set; }
        public bool IsActive { get; set; }
        public short? CompanyId { get; set; }
        public List<AssetTyre> Details { get; set; } = new List<AssetTyre>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructore
        public Asset()
        {
        }
        #endregion

        #region internal methods
        internal static Asset Get(short assetId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetById"))
            {
                db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Asset
                        {
                            AssetId = Convert.ToInt16(dr["AssetId"]),
                            AssetNo = dr["AssetNo"].ToString(),
                            AssetTypeId = Convert.ToInt16(dr["AssetTypeId"]),
                            CapacityId = Convert.ToInt16(dr["CapacityId"]),
                            MakeId = Convert.ToInt16(dr["MakeId"]),
                            Model = dr["Model"].ToString(),
                            PurchaseDate = agHelper.dtDBNull(dr["PurchaseDate"]),
                            LeaseTypeId = Convert.ToInt16(dr["LeaseTypeId"]),
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            StartKMs = Convert.ToDecimal(dr["StartKMs"]),
                            KMs = Convert.ToDecimal(dr["KMs"]),
                            DriverId1 = agHelper.sDBNull(dr["DriverId1"]),
                            DriverId2 = agHelper.sDBNull(dr["DriverId2"]),
                            TrailerId = agHelper.sDBNull(dr["TrailerId"]),
                            FACode = dr["FACode"].ToString(),
                            StatusId = Convert.ToInt16(dr["StatusId"]),
                            CityId = Convert.ToInt16(dr["CityId"]),
                            ClientId = agHelper.sDBNull(dr["ClientId"]),
                            BaseId = agHelper.sDBNull(dr["BaseId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr),
                            Details = AssetTyre.Get(assetId)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static Asset GetStatus(string assetNo, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetStatusByAssetId"))
            {
                db.AddInParameter(dbCommand, "AssetNo", SqlDbType.VarChar, assetNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Asset
                        {
                            AssetNo = assetNo,
                            AssetId = Convert.ToInt16(dr["AssetId"]),
                            AssetTypeId = Convert.ToInt16(dr["AssetTypeId"]),
                            StatusId = Convert.ToInt16(dr["StatusId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Asset a, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAsset"))
                {
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, a.AssetId);
                    db.AddInParameter(dbCommand, "AssetNo", SqlDbType.VarChar, a.AssetNo);
                    db.AddInParameter(dbCommand, "AssetTypeId", SqlDbType.SmallInt, a.AssetTypeId);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, a.CapacityId);
                    db.AddInParameter(dbCommand, "MakeId", SqlDbType.SmallInt, a.MakeId);
                    db.AddInParameter(dbCommand, "Model", SqlDbType.VarChar, a.Model);
                    db.AddInParameter(dbCommand, "PurchaseDate", SqlDbType.DateTime, a.PurchaseDate);
                    db.AddInParameter(dbCommand, "LeaseTypeId", SqlDbType.SmallInt, a.LeaseTypeId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, a.SupplierId);
                    db.AddInParameter(dbCommand, "StartKMs", SqlDbType.Decimal, a.StartKMs);
                    db.AddInParameter(dbCommand, "KMs", SqlDbType.Decimal, a.KMs);
                    db.AddInParameter(dbCommand, "DriverId1", SqlDbType.SmallInt, a.DriverId1);
                    db.AddInParameter(dbCommand, "DriverId2", SqlDbType.SmallInt, a.DriverId2);
                    db.AddInParameter(dbCommand, "TrailerId", SqlDbType.SmallInt, a.TrailerId);
                    db.AddInParameter(dbCommand, "FACode", SqlDbType.VarChar, a.FACode);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, a.IsActive);
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, a.CityId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, a.ClientId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "BaseId", SqlDbType.SmallInt, a.BaseId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, a.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newAssetId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    a.AssetId = Convert.ToInt16(dbCommand.Parameters["@newAssetId"].Value);
                    AssetTyre.Save(a.AssetId.Value, a.Details, userId, transaction);
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

        internal static bool SaveStatus(short assetId , short statusId, short newStatusId,
            string reason, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAssetStatusChange"))
                {
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetId);
                    db.AddInParameter(dbCommand, "StatusId", SqlDbType.SmallInt, statusId);
                    db.AddInParameter(dbCommand, "NewStatusId", SqlDbType.SmallInt, newStatusId);
                    db.AddInParameter(dbCommand, "Reason", SqlDbType.VarChar, reason);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
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