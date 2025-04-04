using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;

namespace TMSAPI.Areas.Download.Models
{
    public class InvoiceSummary
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties        
        public string InvoiceNo { get; set; }    
        public string InvoiceDate { get; set; }
        public short ClientId { get; set; }
        public string ClientName { get; set; }
        public double GrossAmount { get; set; }      
        public double GstAmount { get; set; }
        public double TotalAmount { get; set; }
        public string InvoiceMonth { get; set; }
        public string InvoiceFrom { get; set; }
        public string InvoiceTo { get; set; }
        public string WorkFlowName { get; set; }
        #endregion

        #region constructor
        public InvoiceSummary()
        {
        }

        public InvoiceSummary(string _invoiceNo, string _invoiceDate, short _clientId, string _clientName, double _grossAmount,
            double _gstAmount, double _totalAmount, string _invoiceMonth, string _invoiceFrom, string _invoiceTo, string _workFlowName)
        {
            InvoiceNo = _invoiceNo;
            InvoiceDate = _invoiceDate;
            ClientId = _clientId;
            ClientName = _clientName;
            GrossAmount = _grossAmount;
            GstAmount = _gstAmount;
            TotalAmount = _totalAmount;
            InvoiceMonth = _invoiceMonth;
            InvoiceFrom = _invoiceFrom;
            InvoiceTo = _invoiceTo;
            WorkFlowName = _workFlowName;          

        }
        #endregion

        #region internal methods
        internal static List<InvoiceSummary> Get(DateTime dateFrom, DateTime dateTo, short companyId, string userId)
        {
            List<InvoiceSummary> lstIS = new List<InvoiceSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extInvoiceSummary"))
            {
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                //db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, DateTime.ParseExact(_dateFrom, "ddMMyyyy", CultureInfo.InvariantCulture));  
                //db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, DateTime.ParseExact(_dateTo, "ddMMyyyy", CultureInfo.InvariantCulture));
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataSet ds = db.ExecuteDataSet(dbCommand);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        lstIS.Add(new InvoiceSummary(
                            dr["InvoiceNo"].ToString(),
                            dr["InvoiceDate"].ToString(),
                            Convert.ToInt16(dr["ClientId"]),
                            dr["ClientName"].ToString(),
                             Convert.ToDouble(dr["GrossAmount"]),
                                Convert.ToDouble(dr["GSTAmount"]),
                             Convert.ToDouble(dr["TotalAmount"]),                            
                            dr["InvoiceMonth"].ToString(),
                            dr["InvoiceFrom"].ToString(),
                            dr["InvoiceTo"].ToString(),
                            dr["WorkFlowName"].ToString()));
                    }
                }
            }
            return lstIS;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}