using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRFreightKLTon
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short? FreightTypeId { get; set; }
        public short? RouteId { get; set; }
        public double TonRate { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRFreightKLTon()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_CRFreightKLTon> Get(short formId)
        {
            List<WF_CRFreightKLTon> crklt = new List<WF_CRFreightKLTon>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWFClientRate_FreightKLTon"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            crklt.Add(new WF_CRFreightKLTon
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                FreightTypeId = Convert.ToInt16(dr["FreightTypeId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                TonRate = Convert.ToDouble(dr["TonRate"]),
                                //StdKMPlain = Convert.ToDouble(dr["StdKMPlain"]),
                                //StdKMHilly = Convert.ToDouble(dr["StdKMHilly"]),
                                //Convert.ToDouble(dr["Detentionupto24hours"]),
                                //Convert.ToDouble(dr["Detention25to48hours"]),
                                //   Convert.ToDouble(dr["Detentionafter48hours"])
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return crklt;
        }

        internal static bool Save(int formId, short rateTypeId, List<WF_CRFreightKLTon> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRFreightKLTon crklt in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWFClientRate_FreightKLTon"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crklt.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crklt.CDetailId);
                    //db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crklt.FromDate);
                    db.AddInParameter(dbCommand, "FreightTypeId", SqlDbType.SmallInt, crklt.FreightTypeId);
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crklt.RouteId);
                    db.AddInParameter(dbCommand, "TonRate", SqlDbType.Float, crklt.TonRate);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crklt.Delete ? "D" : (crklt.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
