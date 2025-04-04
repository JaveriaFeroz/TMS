using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JR : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? VoucherId { get; set; }
        public string VoucherNo { get; set; }
        public DateTime? VoucherDate { get; set; }
        public short? BankAccountId { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public double Amount { get; set; }
        public string PayerName { get; set; }
        public string Narration { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedJRNo { get; set; }
        public string SourceJRNo { get; set; }
        public List<JRDetail> Details { get; set; } = new List<JRDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion       

        #region constructor
        public JR()
        {
        }
        #endregion

        #region internal methods
        internal static JR Get(string voucherNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJRByNo"))
            {
                db.AddInParameter(dbCommand, "VoucherNo", SqlDbType.VarChar, voucherNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new JR
                        {
                            VoucherId = Convert.ToInt32(dr["VoucherId"]),
                            VoucherNo = voucherNo,
                            VoucherDate = Convert.ToDateTime(dr["VoucherDate"]),
                            BankAccountId = Convert.ToInt16(dr["BankAccountId"]),
                            PayerName = dr["PayerName"].ToString(),
                            ChequeNo = dr["ChequeNo"].ToString(),
                            ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                            Amount = Convert.ToDouble(dr["Amount"]),
                            Narration = dr["Narration"].ToString(),
                            ReversedJRNo = dr["ReversedJRNo"].ToString(),
                            SourceJRNo = dr["SourceJRNo"].ToString(),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            Details = JRDetail.Get(Convert.ToInt32(dr["VoucherId"])),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(JR jr, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveJR"))
                {
                    //db.AddInParameter(dbCommand, "VoucherNo", SqlDbType.VarChar, jr.JRNo);
                    db.AddInParameter(dbCommand, "VoucherDate", SqlDbType.DateTime, jr.VoucherDate);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, jr.BankAccountId);
                    db.AddInParameter(dbCommand, "PayerName", SqlDbType.VarChar, jr.PayerName);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, jr.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, jr.ChequeDate);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.VarChar, jr.Amount);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, jr.Narration);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, jr.PeriodId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newVoucherNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newVoucherId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    jr.VoucherNo = dbCommand.Parameters["@NewVoucherNo"].Value.ToString();
                    jr.VoucherId = Convert.ToInt32(dbCommand.Parameters["@NewVoucherId"].Value);
                    JRDetail.Save(jr.VoucherId.Value, jr.Details, userId, transaction);
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

        internal static bool Reverse(string voucherNo, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseJR");
                db.AddInParameter(dbCommandDetail, "VoucherNo", SqlDbType.VarChar, voucherNo);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommandDetail);
                return true;
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