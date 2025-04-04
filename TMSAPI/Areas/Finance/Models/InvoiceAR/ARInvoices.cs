using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class ARInvoices
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string ClientName { get; set; }
        public string ClientInvNo { get; set; }
        public double Amount { get; set; }
        public string PeriodName { get; set; }
        public string SourceInvNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public ARInvoices()
        {
        }
        #endregion

        #region internal methods
        internal static List<ARInvoices> Get(short companyId, string userId)
        {
            List<ARInvoices> invoices = new List<ARInvoices>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetARInvoices"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new ARInvoices
                            {
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                ClientInvNo = dr["ClientInvNo"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceInvNo = dr["SourceInvNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return invoices;
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
