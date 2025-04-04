using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRDetention
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short? CapacityId { get; set; }
        public short? DetentionId { get; set; }
        public double Amount { get; set; } = 0;
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRDetention()
        {

        }
        #endregion

        #region internal methods
        internal static List<WF_CRDetention> Get(short formid)
        {
            List<WF_CRDetention> detentions = new List<WF_CRDetention>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWFClientRate_Detention"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            detentions.Add(new WF_CRDetention
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                DetentionId = Convert.ToInt16(dr["DetentionId"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return detentions;
        }

        internal static bool Save(int formId, short rateTypeId, List<WF_CRDetention> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRDetention crd in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWFClientRate_Detention"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crd.DetailId);
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crd.CDetailId);
                    //db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crd.FromDate);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crd.CapacityId);
                    db.AddInParameter(dbCommand, "DetentionId", SqlDbType.SmallInt, crd.DetentionId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, crd.Amount);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crd.Delete ? "D" : (crd.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
