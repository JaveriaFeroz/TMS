using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class Receipt : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ReceiptId { get; set; }
        public string ReceiptNo { get; set; }
        public DateTime? ReceiptDate { get; set; }
        public short? ClientId { get; set; }
        public short? BankAccountId { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string Narration { get; set; }
        public double Amount { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedReceiptNo { get; set; }
        public string SourceReceiptNo { get; set; }
        public List<ReceiptDetail> Details { get; set; } = new List<ReceiptDetail>();
        public List<ReceiptAllocation> Allocations { get; set; } = new List<ReceiptAllocation>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Receipt()
        {

        }
        #endregion

        #region internal methods
        internal static Receipt Get(string receiptNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetReceiptByNo"))
            {
                db.AddInParameter(dbCommand, "ReceiptNo", SqlDbType.VarChar, receiptNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Receipt
                        {
                            ReceiptId = Convert.ToInt32(dr["ReceiptId"]),
                            ReceiptNo = receiptNo,
                            ReceiptDate = Convert.ToDateTime(dr["ReceiptDate"]),
                            BankAccountId = Convert.ToInt16(dr["BankAccountId"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            ChequeNo = dr["ChequeNo"].ToString(),
                            ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                            Narration = dr["Narration"].ToString(),
                            Amount = Convert.ToDouble(dr["Amount"]),
                            ReversedReceiptNo = dr["ReversedReceiptNo"].ToString(),
                            SourceReceiptNo = dr["SourceReceiptNo"].ToString(),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            Details = ReceiptDetail.Get(Convert.ToInt32(dr["ReceiptId"])),
                            Allocations = ReceiptAllocation.Get(Convert.ToInt32(dr["ReceiptId"])),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Receipt rcpt, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveReceipt"))
                {
                    db.AddInParameter(dbCommand, "ReceiptDate", SqlDbType.DateTime, rcpt.ReceiptDate);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, rcpt.BankAccountId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, rcpt.ClientId);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, rcpt.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, rcpt.ChequeDate);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, rcpt.Narration);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, rcpt.PeriodId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, rcpt.Amount);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newReceiptNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newReceiptId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    rcpt.ReceiptNo = dbCommand.Parameters["@NewReceiptNo"].Value.ToString();
                    rcpt.ReceiptId = Convert.ToInt32(dbCommand.Parameters["@NewReceiptId"].Value);
                    ReceiptDetail.Save(rcpt.ReceiptId.Value, rcpt.Details, transaction);
                    ReceiptAllocation.Save(rcpt.ReceiptId.Value, rcpt.Allocations, transaction);
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

        internal static bool Reverse(string receiptNo, short _companyId, string _userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseReceipt");
                db.AddInParameter(dbCommandDetail, "ReceiptNo", SqlDbType.VarChar, receiptNo);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, _companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
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