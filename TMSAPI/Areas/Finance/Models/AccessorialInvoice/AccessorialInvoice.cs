using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class AccessorialInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.Now;
        public short ClientId { get; set; }
        public decimal Amount { get; set; }
        public decimal? GSTRate { get; set; } = 0;
        public string RefInvNo { get; set; }
        public string RefInvDate { get; set; }
        public string RefInvPeriod { get; set; }
        public short workFlowId { get; set; }
        public string Remarks { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        public List<AccessorialInvoiceDetail> Details { get; set; } = new List<AccessorialInvoiceDetail>();
        #endregion

        #region constructor
        public AccessorialInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static AccessorialInvoice Get(string invNo, short workFlowId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialInvoiceByNo"))
            {
                db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invNo);
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, workFlowId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new AccessorialInvoice
                        {
                            InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                            InvoiceNo = invNo,
                            InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            Remarks = dr["Remarks"].ToString(),
                            RefInvNo = workFlowId == 54 || workFlowId == 55 ? dr["RefInvNo"].ToString() : null,
                            RefInvDate = workFlowId == 54 || workFlowId == 55 ? dr["RefInvDate"].ToString() : null,
                            RefInvPeriod = workFlowId == 54 || workFlowId == 55 ? dr["RefInvPeriod"].ToString() : null,
                            GSTRate = agHelper.dDBNull(dr["GSTRate"]),
                            Amount = Convert.ToDecimal(dr["Amount"]),
                            Footer = new agFooter(dr),
                            Details = AccessorialInvoiceDetail.Get(Convert.ToInt32(dr["InvoiceId"]))
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(AccessorialInvoice ai, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAccessorialInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceDate", SqlDbType.DateTime, ai.InvoiceDate);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ai.ClientId);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, ai.Remarks);
                    db.AddInParameter(dbCommand, "RefInvNo", SqlDbType.VarChar, ai.RefInvNo);
                    db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Decimal, ai.GSTRate);
                    db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, ai.workFlowId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newInvNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "newInvId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    ai.InvoiceNo = dbCommand.Parameters["@NewInvNo"].Value.ToString();
                    ai.InvoiceId = Convert.ToInt32(dbCommand.Parameters["@NewInvId"].Value);
                    AccessorialInvoiceDetail.Save(ai.InvoiceId.Value, ai.Details, userId, transaction);
                    Invoice.Issue(ai.InvoiceId.Value, ai.workFlowId, companyId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception) { transaction.Rollback(); throw; }
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