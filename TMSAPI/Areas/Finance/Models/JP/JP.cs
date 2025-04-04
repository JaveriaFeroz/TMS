using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JP : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? VoucherId { get; set; }
        public string VoucherNo { get; set; }
        public DateTime? VoucherDate { get; set; }
        public short? BankAccountId { get; set; }
        public short? InstrumentId { get; set; }
        public short? ChequeBookId { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string PayeeName { get; set; }
        public string Narration { get; set; }
        public double? Amount { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedJPNo { get; set; }
        public string SourceJPNo { get; set; }
        public bool HasTrip { get; set; } = false;
        public short? ClientId { get; set; }
        public DateTime? JobDateFrom { get; set; }
        public DateTime? JobDateTo { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        public List<JPDetail> Details { get; set; } = new List<JPDetail>();
        public List<JPTrip> Trips { get; set; } = new List<JPTrip>();
        #endregion

        #region constructor
        public JP()
        {
        }
        #endregion

        #region internal methods
        internal static JP Get(string voucherNo, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetJPByNo"))
                {
                    db.AddInParameter(dbCommand, "VoucherNo", SqlDbType.VarChar, voucherNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new JP
                            {
                                VoucherId = Convert.ToInt32(dr["VoucherId"]),
                                VoucherNo = voucherNo,
                                VoucherDate = Convert.ToDateTime(dr["VoucherDate"]),
                                BankAccountId = Convert.ToInt16(dr["BankAccountId"]),
                                InstrumentId = Convert.ToInt16(dr["InstrumentId"]),
                                ChequeBookId = agHelper.sDBNull(dr["ChequeBookId"]),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                                PayeeName = dr["PayeeName"].ToString(),
                                Narration = dr["Narration"].ToString(),
                                ReversedJPNo = dr["ReversedJPNo"].ToString(),
                                SourceJPNo = dr["SourceJPNo"].ToString(),
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                HasTrip = Convert.ToBoolean(dr["HasTrip"]),
                                ClientId = agHelper.sDBNull(dr["ClientId"]),
                                JobDateFrom = agHelper.dtDBNull(dr["JobDateFrom"]),
                                JobDateTo = agHelper.dtDBNull(dr["JobDateTo"]),
                                Details = JPDetail.Get(Convert.ToInt32(dr["VoucherId"])),
                                Trips = JPTrip.Get(Convert.ToInt32(dr["VoucherId"])),
                                Footer = new agFooter(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(JP jp, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveJP"))
                {
                    db.AddInParameter(dbCommand, "VoucherDate", SqlDbType.DateTime, jp.VoucherDate);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, jp.BankAccountId);
                    db.AddInParameter(dbCommand, "InstrumentId", SqlDbType.SmallInt, jp.InstrumentId);
                    db.AddInParameter(dbCommand, "ChequeBookId", SqlDbType.SmallInt, jp.ChequeBookId);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, jp.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, jp.ChequeDate);
                    db.AddInParameter(dbCommand, "PayeeName", SqlDbType.VarChar, jp.PayeeName);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, jp.Narration);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, jp.PeriodId);
                    db.AddInParameter(dbCommand, "HasTrip", SqlDbType.Bit, jp.HasTrip);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, jp.ClientId);
                    db.AddInParameter(dbCommand, "JobDateFrom", SqlDbType.DateTime, jp.JobDateFrom);
                    db.AddInParameter(dbCommand, "JobDateTo", SqlDbType.DateTime, jp.JobDateTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newVoucherNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newVoucherId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    jp.VoucherNo = dbCommand.Parameters["@NewVoucherNo"].Value.ToString();
                    jp.VoucherId = Convert.ToInt32(dbCommand.Parameters["@NewVoucherId"].Value);
                    JPDetail.Save(jp.VoucherId.Value, jp.Details, userId, transaction);
                    JPTrip.Save(jp.VoucherId.Value, jp.Trips, userId, transaction);
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
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseJP");
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