using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class Receipts
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string ReceiptNo { get; set; }
        public string ReceiptDate { get; set; }
        public string ClientName { get; set; }
        public string ChequeNo { get; set; }
        public double Amount { get; set; }
        public string PeriodName { get; set; }
        public string SourceReceiptNo { get; set; }

        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public Receipts()
        {
        }
        #endregion

        #region public functions
        internal static List<Receipts> Get(short companyId, string userId)
        {
            List<Receipts> receipts = new List<Receipts>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetReceipts"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            receipts.Add(new Receipts
                            {
                                ReceiptNo = dr["ReceiptNo"].ToString(),
                                ReceiptDate = dr["ReceiptDate"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceReceiptNo = dr["SourceReceiptNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return receipts;
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
