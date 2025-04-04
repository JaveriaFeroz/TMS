using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Finance.Models
{
    public class ReceiptAllocation
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public bool Selected { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string ClientInvNo { get; set; }
        public double? InvAmount { get; set; }
        public double? PaidAmount { get; set; }
        public double BalAmount { get; set; }
        public double? Amount { get; set; }
        #endregion

        #region constructor
        public ReceiptAllocation()
        {
        }
        #endregion

        #region internal methods
        internal static List<ReceiptAllocation> Get(int receiptId)
        {
            List<ReceiptAllocation> allocations = new List<ReceiptAllocation>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetReceiptAllocationById"))
            {
                db.AddInParameter(dbCommand, "ReceiptId", SqlDbType.VarChar, receiptId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            allocations.Add(new ReceiptAllocation
                            {
                                InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                ClientInvNo = dr["ClientInvNo"].ToString(),
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

        internal static List<ReceiptAllocation> GetOSInvoices(short clientId, short companyId, string userId)
        {
            List<ReceiptAllocation> invoices = new List<ReceiptAllocation>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetOutstandingInvoices"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new ReceiptAllocation
                            {
                                InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                ClientInvNo = dr["ClientInvNo"].ToString(),
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

        internal static bool Save(int receiptId, List<ReceiptAllocation> details, DbTransaction transaction)
        {
            if (details != null)
            {
                foreach (ReceiptAllocation os in details.Where(x => x.Selected))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveReceiptAllocation"))
                    {
                        db.AddInParameter(dbCommand, "receiptId", SqlDbType.VarChar, receiptId);
                        db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.VarChar, os.InvoiceId);
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