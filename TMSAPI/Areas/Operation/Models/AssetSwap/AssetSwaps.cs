using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class AssetSwaps
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? AssetId { get; set; }
        public string AssetNo { get; set; }
        public int? DriverId1 { get; set; }
        public string DriverName1 { get; set; }
        public int? DriverId2 { get; set; }
        public string DriverName2 { get; set; }
        public int? TrailerId { get; set; }
        public string TrailerNo { get; set; }
        public short CityId { get; set; }
        public short LeaseTypeId { get; set; }
        #endregion

        #region constructor
        public AssetSwaps()
        {
        }
        #endregion

        #region internal methods
        internal static List<AssetSwaps> Get(short companyId)
        {
            List<AssetSwaps> assets = new List<AssetSwaps>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetsForSwapping"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            assets.Add(new AssetSwaps
                            {
                                AssetId = Convert.ToInt32(dr["AssetId"]),
                                AssetNo = dr["AssetNo"].ToString(),
                                DriverId1 = agHelper.iDBNull(dr["DriverId1"]),
                                DriverName1 = dr["DriverName1"].ToString(),
                                DriverId2 = agHelper.iDBNull(dr["DriverId2"]),
                                DriverName2 = dr["DriverName2"].ToString(),
                                TrailerId = agHelper.sDBNull(dr["TrailerId"]),
                                TrailerNo = dr["TrailerNo"].ToString(),
                                CityId = Convert.ToInt16(dr["CityId"]),
                                LeaseTypeId = Convert.ToInt16(dr["LeaseTypeId"])
                            });
                        }
                    }
                }
            }
            return assets;
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