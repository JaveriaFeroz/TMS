using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class TripInfo
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RWBId { get; set; }
        public short StateId { get; set; }
        public string StateName { get; set; }
        public short? DestinationId { get; set; }
        public decimal? StdTT { get; set; }
        public DateTime? LastEventDateTime { get; set; }
        public int? LastKMsReading { get; set; }
        public int? StdKMs { get; set; }
        public int? VehicleId { get; set; }
        public string VehicleNo { get; set; }
        public bool Outsourced { get; set; } = false;
        //bool DetentionByTime { get; set; }
        public int DetGraceHRs { get; set; }
        public bool DetGraceHRsFromRwb { get; set; }
        public short? DistanceThreshold { get; set; }
        public short? DriverId1 { get; set; }
        public short? DriverId2 { get; set; }
        public short? TrailerId { get; set; }
        public short? LeaseTypeId { get; set; }
        public short? SupplierId { get; set; }
        public string DriverName1 { get; set; }       
        public string DriverName2 { get; set; }
        public string TrailerNo { get; set; }
        public string SupplierName { get; set; }
        public decimal? CurrentKMs { get; set; }
        public bool EmptryTrip { get; set; } = false;
        
        public List<Event> Events { get; set; } = new List<Event>();
        #endregion

        #region internal methods

        internal static TripInfo Get(string rwbNo, short companyId)
        {
            try
            {               
                List<Event> _events = new List<Event>();
                DbCommand dbCommand2 = db.GetStoredProcCommand("GetRwbEventsByNo");
                db.AddInParameter(dbCommand2, "RwbNo", SqlDbType.VarChar, rwbNo);
                db.AddInParameter(dbCommand2, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand2))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            _events.Add(new Event
                            {
                                EventId = Convert.ToInt16(dr["EventId"]),
                                EventName = dr["EventName"].ToString()
                            });
                        }
                    }
                }

                DbCommand dbCommand = db.GetStoredProcCommand("GetRWBInfoByNo");
                db.AddInParameter(dbCommand, "RwbNo", SqlDbType.VarChar, rwbNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new TripInfo
                        {
                            StateId = Convert.ToInt16(dr["StateId"]),
                            StateName = dr["StateName"].ToString(),
                            DestinationId = agHelper.sDBNull(dr["ConsigneeCityId"]),
                            StdTT = agHelper.dDBNull(dr["StandardTT"]),
                            LastEventDateTime = agHelper.dtDBNull(dr["LastEventDateTime"]),
                            LastKMsReading = agHelper.iDBNull(dr["LastKMsReading"]),
                            StdKMs = agHelper.iDBNull(dr["StdKMs"]),
                            VehicleNo = dr["VehicleNo"].ToString(),
                            VehicleId = agHelper.iDBNull(dr["VehicleId"]),
                            Outsourced = dr["Outsourced"] != DBNull.Value ? Convert.ToBoolean(dr["Outsourced"]) : false,
                            //dr["DetentionByTime"],
                            DetGraceHRs = Convert.ToInt32(dr["DetGraceHRs"]),
                            DetGraceHRsFromRwb = dr["DetGraceHRsFromRwb"] != DBNull.Value ? Convert.ToBoolean(dr["DetGraceHRsFromRwb"]) : false,
                            DistanceThreshold = agHelper.sDBNull(dr["DistanceThreshold"]),
                            RWBId = agHelper.iDBNull(dr["RwbId"]),

                            DriverId1 = agHelper.sDBNull(dr["DriverId1"]),
                            DriverId2 = agHelper.sDBNull(dr["DriverId2"]),
                            TrailerId = agHelper.sDBNull(dr["TrailerId"]),
                            LeaseTypeId = agHelper.sDBNull(dr["LeaseTypeId"]),
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            DriverName1 = dr["DriverName1"].ToString(),
                            DriverName2 = dr["DriverName2"].ToString(),
                            TrailerNo = dr["TrailerNo"].ToString(),
                            SupplierName = dr["SupplierName"].ToString(),
                            EmptryTrip =dr["EmptryTrip"] != DBNull.Value ? Convert.ToBoolean(dr["EmptryTrip"]) : false,
                            //CurrentKMs = agHelper.dDBNull(dr["CurrentKMs"]),
                            Events = _events
                        };
                    }
                    else
                        return null;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}