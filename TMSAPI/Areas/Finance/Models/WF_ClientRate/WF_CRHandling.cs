using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRHandling
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short CapacityId { get; set; }
        public double LoadingChgs { get; set; }
        public double OffLoadingChgs { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRHandling()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_CRHandling> Get(int formId)
        {
            List<WF_CRHandling> handling = new List<WF_CRHandling>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRate_Handling"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            handling.Add(new WF_CRHandling
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                LoadingChgs = Convert.ToDouble(dr["LoadingChgs"]),
                                OffLoadingChgs = Convert.ToDouble(dr["OffLoadingChgs"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return handling;
        }

        internal static bool Save(int formId, List<WF_CRHandling> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRHandling crh in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWFClientRate_Handling"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crh.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crh.CDetailId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crh.FromDate);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.TinyInt, crh.CapacityId);
                    db.AddInParameter(dbCommand, "LoadingChgs", SqlDbType.Float, crh.LoadingChgs);
                    db.AddInParameter(dbCommand, "OffLoadingChgs", SqlDbType.Float, crh.OffLoadingChgs);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crh.Delete ? "D" : (crh.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
