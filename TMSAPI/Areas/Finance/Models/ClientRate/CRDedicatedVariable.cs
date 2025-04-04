using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRDedicatedVariable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public short? CapacityId { get; set; }
        public string CapacityName { get; set; }
        public bool ApplyStdKM { get; set; } = true;
        public double Rate { get; set; } = 0;
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRDedicatedVariable()
        {
        }
        #endregion

        #region internal methods
        internal static List<CRDedicatedVariable> Get(short _clientId)
        {
            List<CRDedicatedVariable> variables = new List<CRDedicatedVariable>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_DedicatedVariable"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.Int, _clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            variables.Add(new CRDedicatedVariable
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                CapacityId = agHelper.sDBNull(dr["CapacityId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                ApplyStdKM = Convert.ToBoolean(dr["ApplyStdKM"]),
                                Rate = Convert.ToDouble(dr["Rate"])
                            });
                        }
                    }
                }
            }
            return variables;
        }

        //internal static bool Save(short clientId, short rateTypeId, List<CRDedicatedVariable> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRDedicatedVariable crdv in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_DedicatedVariable"))
        //        {
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crdv.DetailId);
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crdv.CapacityName);
        //            db.AddInParameter(dbCommand, "RateType", SqlDbType.TinyInt, rateTypeId);
        //            db.AddInParameter(dbCommand, "Effectivedate", SqlDbType.DateTime, crdv.FromDate);  
        //            db.AddInParameter(dbCommand, "ApplyStdKM", SqlDbType.Float, crdv.ApplyStdKM);
        //            db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crdv.Rate);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crdv.Delete ? "D" : (crdv.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}