using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class ___WOEstSubContractor
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short TypeId { get; set; }
        public double Amount { get; set; }
        public string Remarks { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public ___WOEstSubContractor()
        {
        }
        #endregion

        #region internal methods
        internal static List<___WOEstSubContractor> Get(int woId)
        {
            List<___WOEstSubContractor> subcontractors = new List<___WOEstSubContractor>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOEstSubContractersById"))
            {
                db.AddInParameter(dbCommand, "WOId", SqlDbType.VarChar, woId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            subcontractors.Add(new ___WOEstSubContractor
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Remarks = dr["Remarks"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return subcontractors;
        }

        internal static bool Save(int woId, List<___WOEstSubContractor> details, string userId, DbTransaction transaction)
        {
            foreach (___WOEstSubContractor wosc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOEstSubContractor"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, wosc.DetailId);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, wosc.TypeId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, wosc.Amount);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, wosc.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                              wosc.Delete ? "D" : (wosc.Add ? "I" : "U")));
                    db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    wosc.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                }
            }
            return true;
        }
        #endregion
    }
}