using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBExpense : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RWBId { get; set; }
        public string RWBNo { get; set; }
        public int JobId { get; set; }
        public string JobNo { get; set; }
        //public string TransactionDate { get; set; }
        public string RWBDate { get; set; }
        public short BranchId { get; set; }
        public string RWBStateName { get; set; }
        public string JobDate { get; set; }
        public string JobStartDate { get; set; }
        public string JobStateName { get; set; }
        public string Comments { get; set; }
        public decimal FuelAvg { get; set; }
        public decimal TransitTime { get; set; }
        public List<RwbExpenseDetail> Expenses { get; set; } = new List<RwbExpenseDetail>();
        public List<RWBCharge> Charges { get; set; } = new List<RWBCharge>();
        public List<CashFuel> CashFuels { get; set; } = new List<CashFuel>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public RWBExpense()
        {

        }
        #endregion

        #region internal methods
        internal static RWBExpense Get(string rwbNo, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBExpenseByNo"))
            {
                db.AddInParameter(dbCommand, "RWBNo", SqlDbType.VarChar, rwbNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt.Rows.Count > 0)
                    {
                        DataRow dr = dt.Rows[0];
                        return new RWBExpense
                        {
                            RWBNo = rwbNo,
                            RWBId = Convert.ToInt32(dr["RWBId"]),
                            //TransactionDate = dr["TransactionDate"].ToString(),
                            JobNo = dr["JobNo"].ToString(),
                            JobId = Convert.ToInt32(dr["JobId"]),
                            RWBDate = dr["RWBDate"].ToString(),
                            RWBStateName = dr["RwbStateName"].ToString(),
                            JobDate = dr["JobDate"].ToString(),
                            JobStartDate = dr["JobStartDate"].ToString(),
                            JobStateName = dr["JobStateName"].ToString(),
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            FuelAvg = Convert.ToDecimal(dr["FuelAvg"]),
                            TransitTime = Convert.ToDecimal(dr["TransitTime"]),
                            Comments = dr["Comments"].ToString(),
                            Expenses = RwbExpenseDetail.Get(Convert.ToInt32(dr["RWBId"]), companyId),
                            Charges= RWBCharge.Get(Convert.ToInt32(dr["RWBId"])),
                            CashFuels = CashFuel.Get(Convert.ToInt32(dr["RWBId"]), companyId),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(RWBExpense re, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBExpense"))
                    {
                        db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, re.RWBId);
                        //db.AddInParameter(dbCommand, "Transactiondate", SqlDbType.DateTime, DateTime.ParseExact(re.TransactionDate, "dd/MM/yyyy", CultureInfo.CurrentCulture));
                        db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, re.BranchId);
                        db.AddInParameter(dbCommand, "Comments", SqlDbType.VarChar, re.Comments);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, re.Footer.UpdatedOn);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        RwbExpenseDetail.Save(re.RWBId, re.Expenses, companyId, userId, transaction);
                        RWBCharge.Save(re.RWBId, re.Charges, userId, transaction);
                        CashFuel.Save(re.RWBId, re.CashFuels, companyId, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception) { transaction.Rollback(); throw; }
            }
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