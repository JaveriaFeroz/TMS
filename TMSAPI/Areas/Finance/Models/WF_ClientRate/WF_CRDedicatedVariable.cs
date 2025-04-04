using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRDedicatedVariable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short? CapacityId { get; set; }
        public bool ApplyStdKM { get; set; } = true;
        public double Rate { get; set; } = 0;
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRDedicatedVariable()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_CRDedicatedVariable> Get(short formId)
        {
            List<WF_CRDedicatedVariable> variables = new List<WF_CRDedicatedVariable>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRate_DedicatedVariable"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            variables.Add(new WF_CRDedicatedVariable
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                CapacityId = agHelper.sDBNull(dr["CapacityId"]),
                                ApplyStdKM = Convert.ToBoolean(dr["ApplyStdKM"]),
                                Rate = Convert.ToDouble(dr["Rate"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return variables;
        }

        internal static bool Save(int formId, short rateTypeId, List<WF_CRDedicatedVariable> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRDedicatedVariable crdv in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_ClientRate_DedicatedVariable"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crdv.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crdv.CDetailId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crdv.FromDate);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crdv.CapacityId);
                    //db.AddInParameter(dbCommand, "RateType", SqlDbType.TinyInt, rateTypeId);
                    db.AddInParameter(dbCommand, "ApplyStdKM", SqlDbType.Float, crdv.ApplyStdKM);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crdv.Rate);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crdv.Delete ? "D" : (crdv.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}