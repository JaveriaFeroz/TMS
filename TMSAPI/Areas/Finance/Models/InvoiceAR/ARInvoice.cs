using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ARInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public short? ClientId { get; set; }
        public string ClientInvNo { get; set; }
        public DateTime? ClientInvDate { get; set; }
        public double Amount { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string Narration { get; set; }
        public string ReversedInvoiceNo { get; set; }
        public string SourceInvoiceNo { get; set; }
        public List<ARInvoiceDetail> Details { get; set; } = new List<ARInvoiceDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ARInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static ARInvoice Get(string invNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetARInvoiceByNo"))
            {
                db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new ARInvoice
                        {
                            InvoiceNo = invNo,
                            InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                            InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            ClientInvNo = dr["ClientInvNo"].ToString(),
                            ClientInvDate = Convert.ToDateTime(dr["ClientInvDate"]),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            Narration = dr["Narration"].ToString(),
                            Amount = Convert.ToDouble(dr["Amount"]),
                            ReversedInvoiceNo = dr["ReversedInvoiceNo"].ToString(),
                            SourceInvoiceNo = dr["SourceInvoiceNo"].ToString(),
                            Footer = new agFooter(dr),
                            Details = ARInvoiceDetail.Get(Convert.ToInt32(dr["InvoiceId"]))
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ARInvoice ar, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveARInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceDate", SqlDbType.DateTime, ar.InvoiceDate);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ar.ClientId);
                    db.AddInParameter(dbCommand, "ClientInvNo", SqlDbType.VarChar, ar.ClientInvNo);
                    db.AddInParameter(dbCommand, "ClientInvDate", SqlDbType.DateTime, ar.ClientInvDate);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.VarChar, ar.Amount);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, ar.Narration);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, ar.PeriodId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newInvNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newInvId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    ar.InvoiceNo = dbCommand.Parameters["@NewInvNo"].Value.ToString();
                    ar.InvoiceId = Convert.ToInt32(dbCommand.Parameters["@NewInvId"].Value);
                    ARInvoiceDetail.Save(ar.InvoiceId.Value, ar.Details, userId, transaction);
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

        internal static bool Reverse(string invNo, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseARInvoice");
                db.AddInParameter(dbCommandDetail, "InvoiceNo", SqlDbType.VarChar, invNo);
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