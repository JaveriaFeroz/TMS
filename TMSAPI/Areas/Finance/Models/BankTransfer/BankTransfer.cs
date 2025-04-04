using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class BankTransfer : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? TransferId { get; set; }
        public string TransferNo { get; set; }
        public DateTime? TransferDate { get; set; }
        public short? CRBankAccountId { get; set; }
        public short? DRBankAccountId { get; set; }
        public short? InstrumentId { get; set; }
        public short? ChequeBookId { get; set; }
        //public short? ChequeId { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string Narration { get; set; }
        //public double? Amount { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedTransferNo { get; set; }
        public string SourceTransferNo { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        public List<BankTransferDetail> Details { get; set; } = new List<BankTransferDetail>();
        #endregion

        #region constructor
        public BankTransfer()
        {
        }
        #endregion

        #region internal methods
        internal static BankTransfer Get(string transferNo, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetBankTransferByNo"))
                {
                    db.AddInParameter(dbCommand, "TransferNo", SqlDbType.VarChar, transferNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new BankTransfer
                            {
                                TransferId = Convert.ToInt32(dr["TransferId"]),
                                TransferNo = transferNo,
                                TransferDate = Convert.ToDateTime(dr["TransferDate"]),
                                CRBankAccountId = Convert.ToInt16(dr["CRBankAccountId"]),
                                DRBankAccountId = Convert.ToInt16(dr["DRBankAccountId"]),
                                InstrumentId = Convert.ToInt16(dr["InstrumentId"]),
                                ChequeBookId = agHelper.sDBNull(dr["ChequeBookId"]),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                                Narration = dr["Narration"].ToString(),
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                ReversedTransferNo = dr["ReversedTransferNo"].ToString(),
                                SourceTransferNo = dr["SourceTransferNo"].ToString(),
                                Details = BankTransferDetail.Get(Convert.ToInt32(dr["TransferId"])),
                                Footer = new agFooter(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch(Exception ex) { throw ex; }
        }

        internal static bool Save(BankTransfer bt, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveBankTransfer"))
                {
                    db.AddInParameter(dbCommand, "TransferDate", SqlDbType.DateTime, bt.TransferDate);
                    db.AddInParameter(dbCommand, "CRBankAccountId", SqlDbType.SmallInt, bt.CRBankAccountId);
                    db.AddInParameter(dbCommand, "DRBankAccountId", SqlDbType.SmallInt, bt.DRBankAccountId);
                    db.AddInParameter(dbCommand, "InstrumentId", SqlDbType.SmallInt, bt.InstrumentId);
                    db.AddInParameter(dbCommand, "ChequeBookId", SqlDbType.SmallInt, bt.ChequeBookId);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, bt.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, bt.ChequeDate);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, bt.Narration);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, bt.PeriodId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newTransferNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newTransferId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    bt.TransferNo = dbCommand.Parameters["@NewTransferNo"].Value.ToString();
                    bt.TransferId = Convert.ToInt32(dbCommand.Parameters["@NewTransferId"].Value);
                    BankTransferDetail.Save(bt.TransferId.Value, bt.Details, userId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }

        internal static bool Reverse(string transferNo, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseBankTransfer");
                db.AddInParameter(dbCommandDetail, "TransferNo", SqlDbType.VarChar, transferNo);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommandDetail);
                return true;
            }
            catch (Exception ex) { throw ex; }
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