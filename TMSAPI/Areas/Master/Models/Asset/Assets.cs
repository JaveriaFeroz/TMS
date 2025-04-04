using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class Assets
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public property       
        public int AssetId { get; set; }      
        public string AssetNo { get; set; }      
        public bool IsActive { get; set; }       
        public double KMs { get; set; }
        public short? TrailerId { get; set; }
        public string TrailerNo { get; set; }
        public short? DriverId1 { get; set; }
        public string DriverName1 { get; set; }
        public short? DriverId2 { get; set; }
        public string DriverName2 { get; set; }
        public short? LeaseTypeId { get; set; }
        public short? AssetTypeId { get; set; }
        public string AssetTypeName { get; set; }
        public short? CapacityId { get; set; }
        public string CapacityName { get; set; }
        public short? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public double Carriage { get; set; }
        public short? CurrentCityId { get; set; }
        public short? ClientId { get; set; }
        #endregion

        #region constructor
        public Assets()
        {
        }
        #endregion

        #region internal methods
        internal static List<Assets> Get(short companyId, bool _activeOnly = true)
        {
            List<Assets> assets = new List<Assets>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssets"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new Assets
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"]),
                                KMs = Convert.ToDouble(dr["KMs"]),
                                AssetTypeId=Convert.ToInt16(dr["AssetTypeId"]),
                                AssetTypeName = dr["AssetTypeName"].ToString(),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                Carriage = Convert.ToDouble(dr["Carriage"])
                            });
                        }
                    }
                    return assets;
                }
            }
        }

        internal static List<Assets> GetOwned(short companyId, bool _activeOnly = true)
        {
            List<Assets> assets = new List<Assets>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetOwnVehicles"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new Assets
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString()
                            });
                        }
                    }
                    return assets;
                }
            }
        }

        internal static List<Assets> GetWithStatusAndCity(short companyId, bool _activeOnly = true)
        {
            List<Assets> assets = new List<Assets>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetsWithStatusAndCity"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new Assets
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString()
                            });
                        }
                    }
                    return assets;
                }
            }
        }

        internal static List<Assets> GetForRWB(int rwbId, short companyId, short assetTypeId)
        {
            List<Assets> assets = new List<Assets>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetsforRWBId"))
            {
                db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "AssetTypeId", SqlDbType.VarChar, assetTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new Assets
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString(),
                                TrailerId = agHelper.sDBNull(dr["TrailerId"]),
                                TrailerNo = dr["TrailerNo"].ToString(),
                                DriverId1 = agHelper.sDBNull(dr["DriverId1"]),
                                DriverName1 = dr["DriverName1"].ToString(),
                                DriverId2 = agHelper.sDBNull(dr["DriverId2"]),
                                DriverName2 = dr["DriverName2"].ToString(),
                                LeaseTypeId = agHelper.sDBNull(dr["LeaseTypeId"]),
                                KMs = Convert.ToDouble(dr["KMs"]),
                                SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                                SupplierName = dr["SupplierName"].ToString()
                            });
                        }
                    }
                    return assets;
                }
            }
        }

        internal static List<Assets> GetByAssetType(short companyId, short assetTypeId, bool _activeOnly = true)
        {
            try
            {
                List<Assets> assets = new List<Assets>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetsByAssetTypeId"))
                {
                    db.AddInParameter(dbCommand, "AssetTypeId", SqlDbType.SmallInt, assetTypeId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                assets.Add(new Assets
                                {
                                    AssetId = Convert.ToInt32(dr["AssetId"]),
                                    AssetNo = dr["AssetNo"].ToString(),
                                    TrailerId = agHelper.sDBNull(dr["TrailerId"]),
                                    TrailerNo = dr["TrailerNo"].ToString(),
                                    DriverId1 = agHelper.sDBNull(dr["DriverId1"]),
                                    DriverName1 = dr["DriverName1"].ToString(),
                                    DriverId2 = agHelper.sDBNull(dr["DriverId2"]),
                                    DriverName2 = dr["DriverName2"].ToString(),
                                    LeaseTypeId = Convert.ToInt16(dr["LeaseTypeId"]), 
                                    KMs = Convert.ToDouble(dr["KMs"]),
                                    SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                                    SupplierName = dr["SupplierName"].ToString()
                                });
                            }
                        }
                        return assets;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static List<Assets> GetWithCapacity(short companyId, bool _activeOnly = true)
        {
            List<Assets> assets = new List<Assets>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetsWithCapacity"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new Assets
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"]),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                Carriage = Convert.ToDouble(dr["Carriage"]),
                                CurrentCityId = Convert.ToInt16(dr["CityId"]),
                                ClientId = agHelper.sDBNull(dr["ClientId"])
                            });
                        }
                    }
                    return assets;
                }
            }
        }
        #endregion
    }
}