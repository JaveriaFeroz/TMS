using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRDedicatedRent
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public string VehicleNo { get; set; }
        public short? VehicleId { get; set; }
        public short? VehicleGroupId { get; set; }
        public string VehicleGroupName { get; set; }
        public double Amount { get; set; } = 0;
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        //public string ProRate { get; set; } = "False";
        #endregion

        #region constructor
        public CRDedicatedRent()
        {

        }
        #endregion

        #region internal methods
        internal static List<CRDedicatedRent> Get(short ClientId)
        {
            List<CRDedicatedRent> rents = new List<CRDedicatedRent>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_DedicatedRent"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ClientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rents.Add(new CRDedicatedRent
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                VehicleId = Convert.ToInt16(dr["VehicleId"]),
                                VehicleGroupId = agHelper.sDBNull(dr["VehicleGroupId"]),
                                FromDate = dr["FromDate"].ToString(),
                                VehicleNo = dr["VehicleNo"].ToString(),
                                VehicleGroupName = dr["VehicleGroupName"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"])//
                                //ProRate = dr["ProRate"].ToString()
                            });
                        }
                    }
                }
            }
            return rents;
        }

        //internal static bool Save(short _clientId, short _rateTypeId, List<CRDedicatedRent> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRDedicatedRent crvr in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_DedicatedRent"))
        //        {
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crvr.DetailId);
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _clientId);
        //            db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, _rateTypeId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crvr.FromDate); 
        //            db.AddInParameter(dbCommand, "VehicleId", SqlDbType.SmallInt, crvr.VehicleNo);
        //            db.AddInParameter(dbCommand, "VehicleGroupId", SqlDbType.SmallInt, crvr.VehicleGroupName);
        //            db.AddInParameter(dbCommand, "ProRate", SqlDbType.Bit, crvr.ProRate);
        //            db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, crvr.Amount);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crvr.Delete ? "D" : (crvr.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}