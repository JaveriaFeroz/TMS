using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Common.Models;

namespace TMSAPI.Areas.Finance.Models
{
    public class Invoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string InvoiceNo { get; set; }    
        #endregion

        #region constructor
        public Invoice()
        {
            
        }
        #endregion

        #region internal methods
        internal static bool Generate(short clientId, DateTime dateFrom, DateTime dateTo, 
         bool reApplyRates, decimal GSTRate, short companyId, string userId, out short invCount)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GenerateInvoices"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "ToDate", SqlDbType.DateTime, dateTo);
                db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Float, GSTRate);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "reApplyRates", SqlDbType.Bit, reApplyRates);
                db.AddOutParameter(dbCommand, "Counter", SqlDbType.SmallInt, 32);
                db.ExecuteNonQuery(dbCommand);
                invCount = Convert.ToInt16(dbCommand.Parameters["@Counter"].Value);
                return true;
            }
        }

        internal static bool UnInvoice(string invoiceNo, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("UnInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invoiceNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Submit(Submission submission)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitInvoice");
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, submission.FormId);
                db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, submission.Comments);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, submission.StateId);
                db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, submission.UserId);
                db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, submission.Owner);
                db.AddInParameter(dbCommandDetail, "IsCompleted", SqlDbType.Bit, submission.Completed);
                db.ExecuteNonQuery(dbCommandDetail);
            }
            catch (Exception) { throw; }
            return true;
        }

        internal static bool Issue(int invoiceId, short workFlowId, short companyId, DbTransaction transaction)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("IssueInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                    db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, workFlowId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    //db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand, transaction);
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
