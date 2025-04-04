using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRDetention
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public short? CapacityId { get; set; }
        public string CapacityName { get; set; }
        public short? DetentionId { get; set; }
        public string DetentionName { get; set; }
        public double Amount { get; set; } = 0;
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRDetention()
        {

        }
        #endregion

        #region internal methods
        internal static List<CRDetention> Get(short clientId)
        {
            List<CRDetention> detentions = new List<CRDetention>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_Detention"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            detentions.Add(new CRDetention
                            {
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                DetentionId = Convert.ToInt16(dr["DetentionId"]),
                                CapacityName = dr["CapacityName"].ToString(),
                                DetentionName = dr["DetentionName"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"])
                            });
                        }
                    }
                }
            }
            return detentions;
        }

        //internal static bool Save(short clientId, short rateTypeId, List<CRDetention> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRDetention crd in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_Detention"))
        //        {
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crd.DetailId);
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crd.FromDate);
        //            db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crd.CapacityId);
        //            db.AddInParameter(dbCommand, "DetentionId", SqlDbType.SmallInt, crd.DetentionId);
        //            db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, crd.Amount);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crd.Delete ? "D" : (crd.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
