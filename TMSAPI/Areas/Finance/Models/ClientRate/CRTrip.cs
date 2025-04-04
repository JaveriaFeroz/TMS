using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRTrip
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public short? CapacityId { get; set; }
        public short? RouteId { get; set; }
        public string CapacityName { get; set; }
        public string RouteName { get; set; }
        public double Rate { get; set; }
        public double? RateExWtKg { get; set; }
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRTrip()
        {

        }
        #endregion

        #region internal methods
        internal static List<CRTrip> Get(short clientId)
        {
            List<CRTrip> rates = new List<CRTrip>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_Trip"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rates.Add(new CRTrip
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                RouteName = dr["RouteName"].ToString(),
                                Rate = Convert.ToDouble(dr["Rate"]),
                                RateExWtKg = Convert.ToDouble(dr["RateExWtKg"])
                            });
                        }
                    }
                }
            }
            return rates;
        }

        //internal static bool Save(short clientId, short rateTypeId, List<CRTrip> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRTrip crt in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_Trip"))
        //        {
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crt.DetailId);
        //            db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crt.FromDate);
        //            db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crt.CapacityId);
        //            db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crt.RouteName);
        //            db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crt.Rate);
        //            db.AddInParameter(dbCommand, "RateExWtKg", SqlDbType.Float, crt.RateExWtKg);
        //            //db.AddInParameter(dbCommand, "LoadingChgs", SqlDbType.Float, crt.LoadingChgs);
        //            //db.AddInParameter(dbCommand, "OffloadingChgs", SqlDbType.Float, crt.OffloadingChgs);
        //            //db.AddInParameter(dbCommand, "DetUpto24hours", SqlDbType.Float, crt.DetUpto24hours);
        //            //db.AddInParameter(dbCommand, "Det25to48hours", SqlDbType.Float, crt.Det25to48hours);
        //            //db.AddInParameter(dbCommand, "DetAfter48hours", SqlDbType.Float, crt.DetAfter48hours);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crt.Delete ? "D" : (crt.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
