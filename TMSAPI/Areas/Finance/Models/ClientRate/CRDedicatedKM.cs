using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRDedicatedKM
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public short? RouteId { get; set; }
        public string RouteName { get; set; }
        public short? RouteGroupId { get; set; }
        public string RouteGroupName { get; set; }
        public double Distance { get; set; }
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRDedicatedKM()
        {
        }
        #endregion

        #region internal methods
        internal static List<CRDedicatedKM> Get(short clientId)
        {
            List<CRDedicatedKM> kms = new List<CRDedicatedKM>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_DedicatedKM"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            kms.Add(new CRDedicatedKM
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                RouteGroupId = agHelper.sDBNull(dr["RouteGroupId"]),
                                RouteName = dr["RouteName"].ToString(),
                                RouteGroupName = dr["RouteGroupName"].ToString(),
                                Distance = Convert.ToDouble(dr["Distance"])
                            });
                        }
                    }
                }
            }
            return kms;
        }

        //internal static bool Save(short _clientId, List<CRDedicatedKM> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRDedicatedKM crkm in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_DedicatedKM"))
        //        {
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _clientId);
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crkm.DetailId);
        //            db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crkm.RouteName);
        //            db.AddInParameter(dbCommand, "RouteGroupId", SqlDbType.SmallInt, crkm.RouteGroupName);
        //            db.AddInParameter(dbCommand, "Distance", SqlDbType.Float, crkm.Distance);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crkm.Delete ? "D" : (crkm.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
