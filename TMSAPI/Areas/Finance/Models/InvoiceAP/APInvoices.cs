using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class APInvoices
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string PIVNo { get; set; }
        public DateTime? PIVDate { get; set; }
        public string SupplierName { get; set; }
        public string SupplierInvNo { get; set; }
        public double Amount { get; set; }
        public string PeriodName { get; set; }
        public string SourcePIVNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public APInvoices()
        { }
        #endregion

        #region public functions
        internal static List<APInvoices> Get(short companyId, string userId)
        {
            List<APInvoices> invoices = new List<APInvoices>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAPInvoices"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new APInvoices
                            {
                                PIVNo = dr["PIVNo"].ToString(),
                                PIVDate = Convert.ToDateTime(dr["PIVDate"]),
                                SupplierName = dr["SupplierName"].ToString(),
                                SupplierInvNo = dr["SupplierInvNo"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourcePIVNo = dr["SourcePIVNo"].ToString(),
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
