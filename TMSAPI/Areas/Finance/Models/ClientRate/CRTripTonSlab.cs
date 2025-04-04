using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRTripTonSlab
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public short? CapacityId { get; set; }
        public short? RouteId { get; set; }
        public short? WayTypeId { get; set; } = 1;
        public string CapacityName { get; set; }
        public string RouteName { get; set; }
        public string WayTypeName { get; set; } = "one-way";
        public double? WeightFrom { get; set; } = 0;
        public double? WeightTo { get; set; } = 0;
        public double Rate { get; set; } = 0;
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRTripTonSlab()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<CRTripTonSlab> Get(short clientId)
        {
            List<CRTripTonSlab> slabs = new List<CRTripTonSlab>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_TripTonSlab"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            slabs.Add(new CRTripTonSlab
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                WayTypeId = Convert.ToInt16(dr["WayTypeId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                RouteName = dr["RouteName"].ToString(),
                                WayTypeName = dr["WayTypeName"].ToString(),
                                WeightFrom = Convert.ToDouble(dr["WeightFrom"]),
                                WeightTo = Convert.ToDouble(dr["WeightTo"]),
                                Rate = Convert.ToDouble(dr["Rate"])
                            });
                        }
                    }
                }
            }
            return slabs;
        }

        //internal static bool Save(short clientId, short rateTypeId, List<CRTripTonSlab> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRTripTonSlab crts in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_TripTonSlab"))
        //        {
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crts.DetailId);
        //            db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crts.FromDate);
        //            db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crts.RouteName);
        //            db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crts.CapacityId);
        //            db.AddInParameter(dbCommand, "WayTypeId", SqlDbType.SmallInt, crts.WayTypeName);
        //            db.AddInParameter(dbCommand, "WeightFrom", SqlDbType.Float, crts.WeightFrom);
        //            db.AddInParameter(dbCommand, "WeightTo", SqlDbType.Float, crts.WeightTo);
        //            db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crts.Rate);
        //            //db.AddInParameter(dbCommand, "Detentionafter48hours", SqlDbType.Float, crts.Detentionafter48hours);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crts.Delete ? "D" : (crts.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
