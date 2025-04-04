using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class AccessorialInvoices 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string ClientName { get; set; }
        public int InvoiceId { get; set; }
        #endregion

        #region constructor
        public AccessorialInvoices()
        {

        }
        #endregion

        #region internal methods
        internal static List<AccessorialInvoices> Get(short workFlowId, short companyId, string userId)
        {
            List<AccessorialInvoices> invoices = new List<AccessorialInvoices>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialInvoices"))
            {
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, workFlowId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new AccessorialInvoices
                            {
                                InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                ClientName = dr["ClientName"].ToString()
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
