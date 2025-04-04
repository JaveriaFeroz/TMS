using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class CRDedicatedTollTax
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public string FromDate { get; set; }
        public double TollPerKM { get; set; }
        //these properties are kept just to support get existing client rate function as otherwise it is not working correctly for WF Client Rate
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CRDedicatedTollTax()
        {
        }
        #endregion

        #region internal methods
        internal static List<CRDedicatedTollTax> Get(short clientId)
        {
            List<CRDedicatedTollTax> tolls = new List<CRDedicatedTollTax>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_DedicatedTollTax"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            tolls.Add(new CRDedicatedTollTax
                            {
                                //DetailId = Convert.ToInt32(dr["DetailId"]),
                                CDetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = dr["FromDate"].ToString(),
                                TollPerKM = Convert.ToDouble(dr["TollPerKM"])
                            });
                        }
                    }
                }
            }
            return tolls;
        }

        //internal static bool Save(short clientId, List<CRDedicatedTollTax> details, string userId, DbTransaction transaction)
        //{
        //    foreach (CRDedicatedTollTax crtt in agHelper.GetChanges(details))
        //    {
        //        using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRate_DedicatedTollTax"))
        //        {
        //            db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
        //            db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, crtt.DetailId);
        //            db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crtt.FromDate);
        //            db.AddInParameter(dbCommand, "TollPerKM", SqlDbType.Float, crtt.TollPerKM);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
        //                  crtt.Delete ? "D" : (crtt.Add ? "I" : "U")));
        //            db.ExecuteNonQuery(dbCommand, transaction);
        //        }
        //    }
        //    return true;
        //}
        #endregion
    }
}
