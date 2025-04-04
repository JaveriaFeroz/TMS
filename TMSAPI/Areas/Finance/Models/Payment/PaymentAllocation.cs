using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Finance.Models
{
    public class PaymentAllocation
    {       
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public bool Selected { get; set; }
        public int PIVId { get; set; }
        public string PIVNo { get; set; }
        public DateTime? PIVDate { get; set; }
        public string SupplierInvNo { get; set; }
        public double? InvAmount { get; set; }
        public double? PaidAmount { get; set; }
        public double BalAmount { get; set; }
        public double? Amount { get; set; }
        #endregion

        #region constructor
        public PaymentAllocation()
        {
        }
        #endregion

        #region internal methods
        internal static List<PaymentAllocation> Get(int pyId)
        {
            List<PaymentAllocation> allocations = new List<PaymentAllocation>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPaymentAllocationById"))
            {
                db.AddInParameter(dbCommand, "PYId", SqlDbType.VarChar, pyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            allocations.Add(new PaymentAllocation
                            {
                                PIVId = Convert.ToInt32(dr["InvoiceId"]),
                                PIVNo = dr["PIVNo"].ToString(),
                                PIVDate = Convert.ToDateTime(dr["PIVDate"]),
                                SupplierInvNo = dr["SupplierInvNo"].ToString(),
                                InvAmount = Convert.ToDouble(dr["InvAmount"]),
                                PaidAmount = Convert.ToDouble(dr["PaidAmount"]),
                                BalAmount = Convert.ToDouble(dr["Balance"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Selected = Convert.ToBoolean(dr["Selected"])
                            });
                        }
                    }
                }
            }
            return allocations;
        }

        internal static List<PaymentAllocation> GetOSInvoices(short supplierId, short companyId, string userId)
        {
            List<PaymentAllocation> invoices = new List<PaymentAllocation>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetOutstandingPIVs"))
            {
                //db.AddInParameter(dbCommand, "DocumentNo", SqlDbType.VarChar, documentNo);
                //db.AddInParameter(dbCommand, "OutStandingOnly", SqlDbType.Bit, outStandingOnly);
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new PaymentAllocation
                            {
                                PIVId = Convert.ToInt32(dr["InvoiceId"]),
                                PIVNo = dr["PIVNo"].ToString(),
                                PIVDate = Convert.ToDateTime(dr["PIVDate"]),
                                SupplierInvNo = dr["SupplierInvNo"].ToString(),
                                InvAmount = Convert.ToDouble(dr["InvAmount"]),
                                PaidAmount = Convert.ToDouble(dr["PaidAmount"]),
                                BalAmount = Convert.ToDouble(dr["Balance"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Selected = Convert.ToBoolean(dr["Selected"])
                            });
                        }
                    }
                }
            }
            return invoices;
        }

        internal static bool Save(int pyId, List<PaymentAllocation> details, DbTransaction transaction)
        {
            if (details != null)
            {
                foreach (PaymentAllocation os in details.Where(x => x.Selected))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SavePaymentAllocation"))
                    {
                        db.AddInParameter(dbCommand, "PYId", SqlDbType.VarChar, pyId);
                        db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.VarChar, os.PIVId);
                        db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, os.Amount);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
            }
            return true;
        }
        #endregion
    }
}
