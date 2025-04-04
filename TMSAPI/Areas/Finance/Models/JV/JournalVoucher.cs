using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JournalVoucher : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? VoucherId { get; set; }
        public string VoucherNo { get; set; }       
        public DateTime? VoucherDate { get; set; }    
        public string Narration { get; set; }
        public string PeriodName { get; set; }
        public string ReversedVoucherNo { get; set; }
        public string SourceVoucherNo { get; set; }
        public List<JournalVoucherDetail> Details { get; set; } = new List<JournalVoucherDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public JournalVoucher()
        {
        }
        #endregion

        #region internal methods
        internal static JournalVoucher Get(string voucherNo, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJVByNo"))
            {
                db.AddInParameter(dbCommand, "VoucherNo", SqlDbType.VarChar, voucherNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new JournalVoucher
                        {
                            VoucherId = Convert.ToInt32(dr["VoucherId"]),
                            VoucherNo = voucherNo,
                            VoucherDate = Convert.ToDateTime(dr["VoucherDate"]),
                            Narration = dr["Narration"].ToString(),
                            PeriodName = dr["PeriodName"].ToString(),
                            ReversedVoucherNo = dr["ReversedVoucherNo"].ToString(),
                            SourceVoucherNo = dr["SourceVoucherNo"].ToString(),
                            Details = JournalVoucherDetail.Get(Convert.ToInt32(dr["VoucherId"])),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(JournalVoucher jv, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveJournalVoucher"))
                {
                    //db.AddInParameter(dbCommand, "VoucherNo", SqlDbType.VarChar, jv.VoucherNo);
                    db.AddInParameter(dbCommand, "VoucherDate", SqlDbType.DateTime, jv.VoucherDate);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, jv.Narration);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "NewId", SqlDbType.VarChar, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    jv.VoucherId = Convert.ToInt32(dbCommand.Parameters["@NewId"].Value);
                    JournalVoucherDetail.Save(jv.VoucherId.Value, jv.Details, userId, transaction);
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
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseJournalVoucher");
                db.AddInParameter(dbCommandDetail, "VoucherNo", SqlDbType.VarChar, voucherNo);
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