using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RwbExpenseDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }     
        public short? ExpenseId { get; set; }
        public double Amount { get; set; }
        public string Remarks { get; set; }
        public bool Locked { get; set; }

        //public bool Add { get; set; } = true;
        //public bool Edit { get; set; } = false;
        //public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public RwbExpenseDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<RwbExpenseDetail> Get(int rwbId, short companyid)
        {
            List<RwbExpenseDetail> details = new List<RwbExpenseDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBExpensesDetailById"))
            {
                db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.Int, companyid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new RwbExpenseDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ExpenseId = Convert.ToInt16(dr["ExpenseId"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Locked = Convert.ToBoolean(dr["Locked"])//,
                                //Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int rwbId, List<RwbExpenseDetail> details, short companyId, string userId, DbTransaction transaction)
        {
            foreach (RwbExpenseDetail red in GetExpenseDetail(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBExpenseDetail"))
                {                   
                    db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "ExpenseId", SqlDbType.SmallInt, red.ExpenseId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, red.Amount);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }

        private static IEnumerable<RwbExpenseDetail> GetExpenseDetail(List<RwbExpenseDetail> _details)
        {
            return _details.Where(a => (a.Amount!=0 && a.DetailId == null));
        }
        #endregion
    }
}