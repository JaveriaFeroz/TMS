using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRFreightKLTon
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public short? FreightTypeId { get; set; }
        public string FreightTypeName { get; set; }
        public short? RouteId { get; set; }
        public string RouteName { get; set; }
        public double TonRate { get; set; }
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRFreightKLTon()
        {
        }
        #endregion

        #region internal methods
        internal static List<CRFreightKLTon> Get(short clientId)
        {
            List<CRFreightKLTon> crklt = new List<CRFreightKLTon>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_FreightKLTon"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            crklt.Add(new CRFreightKLTon
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                FreightTypeId = Convert.ToInt16(dr["FreightTypeId"]),
                                RouteId = agHelper.sDBNull(dr["RouteId"]),
                                FreightTypeName = dr["FreightTypeName"].ToString(),
                                RouteName = dr["RouteName"].ToString(),
                                TonRate = Convert.ToDouble(dr["TonRate"])
                                //StdKMPlain = Convert.ToDouble(dr["StdKMPlain"]),
                                //StdKMHilly = Convert.ToDouble(dr["StdKMHilly"]),
                            });
                        }
                    }
                }
            }
            return crklt;
        }

        //internal static bool Save(short clientId, short rateTypeId, List<CRFreightKLTon> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRFreightKLTon crklt in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_FreightKLTon"))
        //        {
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crklt.DetailId);
        //            db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crklt.FromDate);
        //            db.AddInParameter(dbCommand, "FreightTypeId", SqlDbType.SmallInt, crklt.FreightTypeId);
        //            db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crklt.RouteName);
        //            db.AddInParameter(dbCommand, "TonRate", SqlDbType.Float, crklt.TonRate);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crklt.Delete ? "D" : (crklt.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
