using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Expense : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ExpenseId { get; set; }
        public string ExpenseName { get; set; }
        public string ChargeCode { get; set; }
        public short? AccountId { get; set; }
        public short? AdvAccountId { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Expense()
        {          
        }
        #endregion

        #region internal methods
        internal static Expense Get(short ExpenseId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetExpenseById"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "ExpenseId", SqlDbType.SmallInt, ExpenseId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Expense
                        {
                            ExpenseId = Convert.ToInt16(dr["ExpenseId"]),
                            ExpenseName = dr["ExpenseName"].ToString(),
                            ChargeCode = dr["ChargeCode"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            AccountId = agHelper.sDBNull(dr["AccountId"]),
                            AdvAccountId = agHelper.sDBNull(dr["AdvAccountId"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Expense eh, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveExpense"))
                {
                    db.AddInParameter(dbCommand, "ExpenseId", SqlDbType.SmallInt, eh.ExpenseId);
                    db.AddInParameter(dbCommand, "ChargeCode", SqlDbType.VarChar, eh.ChargeCode);
                    db.AddInParameter(dbCommand, "AccountId", SqlDbType.SmallInt, eh.AccountId);
                    db.AddInParameter(dbCommand, "AdvAccountId", SqlDbType.SmallInt, eh.AdvAccountId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, eh.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, eh.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }     
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    } 
}