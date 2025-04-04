using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class Payment : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? PYId { get; set; }
        public string PYNo { get; set; }
        public DateTime? PYDate { get; set; }
        public short? SupplierId { get; set; }
        public short? BankAccountId { get; set; }
        public short? InstrumentId { get; set; }
        public short? ChequeBookId { get; set; }
        //public short? ChequeId { get; set; }         
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        //public string PayeeName { get; set; }
        public string Narration { get; set; }
        public double? Amount { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedPYNo { get; set; }
        public string SourcePYNo { get; set; }
        public List<PaymentDetail> Details { get; set; } = new List<PaymentDetail>();
        public List<PaymentAllocation> Allocations { get; set; } = new List<PaymentAllocation>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Payment()
        {

        }
        #endregion

        #region internal methods
        internal static Payment Get(string pyNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPaymentByNo"))
            {
                db.AddInParameter(dbCommand, "PYNo", SqlDbType.VarChar, pyNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Payment
                        {
                            PYId = Convert.ToInt32(dr["PYId"]),
                            PYNo = pyNo,
                            PYDate = Convert.ToDateTime(dr["PYDate"]),
                            BankAccountId = Convert.ToInt16(dr["BankAccountId"]),
                            SupplierId = Convert.ToInt16(dr["SupplierId"]),
                            InstrumentId = Convert.ToInt16(dr["InstrumentId"]),
                            ChequeBookId = agHelper.sDBNull(dr["ChequeBookId"]),
                            ChequeNo = dr["ChequeNo"].ToString(),
                            ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                            Amount = Convert.ToDouble(dr["Amount"]),
                            Narration = dr["Narration"].ToString(),
                            ReversedPYNo = dr["ReversedPYNo"].ToString(),
                            SourcePYNo = dr["SourcePYNo"].ToString(),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            Details = PaymentDetail.Get(Convert.ToInt32(dr["PYId"])),
                            Allocations = PaymentAllocation.Get(Convert.ToInt32(dr["PYId"])),
                            Footer = new agFooter(dr),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Payment py, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SavePayment"))
                {
                    db.AddInParameter(dbCommand, "PYDate", SqlDbType.DateTime, py.PYDate);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, py.BankAccountId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, py.SupplierId);
                    db.AddInParameter(dbCommand, "InstrumentId", SqlDbType.SmallInt, py.InstrumentId);
                    db.AddInParameter(dbCommand, "ChequeBookId", SqlDbType.SmallInt, py.ChequeBookId);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, py.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, py.ChequeDate);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, py.Amount);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, py.Narration);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, py.PeriodId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newPYNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newPYId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    py.PYNo = dbCommand.Parameters["@NewPYNo"].Value.ToString();
                    py.PYId = Convert.ToInt32(dbCommand.Parameters["@NewPYId"].Value);
                    PaymentDetail.Save(py.PYId.Value, py.Details, transaction);
                    PaymentAllocation.Save(py.PYId.Value, py.Allocations, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        internal static bool Reverse(string pyNo, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReversePayment");
                db.AddInParameter(dbCommandDetail, "PYNo", SqlDbType.VarChar, pyNo);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommandDetail);
            }
            catch (Exception) { throw; }
            return true;
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