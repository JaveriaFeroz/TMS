using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRTrip
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short? CapacityId { get; set; }
        public short? RouteId { get; set; }
        public double Rate { get; set; }
        public double? RateExWtKg { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRTrip()
        {

        }
        #endregion

        #region internal methods
        internal static List<WF_CRTrip> Get(short formId)
        {
            List<WF_CRTrip> rates = new List<WF_CRTrip>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWFClientRate_Trip"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rates.Add(new WF_CRTrip
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                Rate = Convert.ToDouble(dr["Rate"]),
                                RateExWtKg = Convert.ToDouble(dr["RateExWtKg"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return rates;
        }

        internal static bool Save(int formId, short rateTypeId, List<WF_CRTrip> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRTrip crt in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWFClientRate_Trip"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crt.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crt.CDetailId);
                    // db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crt.FromDate);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crt.CapacityId);
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crt.RouteId);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crt.Rate);
                    db.AddInParameter(dbCommand, "RateExWtKg", SqlDbType.Float, crt.RateExWtKg);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crt.Delete ? "D" : (crt.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
