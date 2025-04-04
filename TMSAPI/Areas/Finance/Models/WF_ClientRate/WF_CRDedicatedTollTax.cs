using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRDedicatedTollTax
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime FromDate { get; set; }
        public double TollPerKM { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRDedicatedTollTax()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_CRDedicatedTollTax> Get(short formId)
        {
            List<WF_CRDedicatedTollTax> tolls = new List<WF_CRDedicatedTollTax>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRate_DedicatedTollTax"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            tolls.Add(new WF_CRDedicatedTollTax
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                TollPerKM = Convert.ToDouble(dr["TollPerKM"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return tolls;
        }

        internal static bool Save(int formId, List<WF_CRDedicatedTollTax> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRDedicatedTollTax crtt in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_ClientRate_DedicatedTollTax"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crtt.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crtt.CDetailId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crtt.FromDate);
                    db.AddInParameter(dbCommand, "TollPerKM", SqlDbType.Float, crtt.TollPerKM);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crtt.Delete ? "D" : (crtt.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
