using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ARInvoiceDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        public short? AccountId { get; set; }
        public short? BranchId { get; set; }
        public short? DeptId { get; set; }
        public string Description { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        public bool ReadOnly { get; set; }
        #endregion

        #region constructor
        public ARInvoiceDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<ARInvoiceDetail> Get(int invoiceId)
        {
            List<ARInvoiceDetail> details = new List<ARInvoiceDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetARInvoiceDetailById"))
            {
                db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new ARInvoiceDetail
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                BranchId = agHelper.sDBNull(dr["BranchId"]),
                                DeptId = agHelper.sDBNull(dr["DepartmentId"]),
                                Description = dr["Description"].ToString(),
                                Debit = Convert.ToDouble(dr["Debit"]),
                                Credit = Convert.ToDouble(dr["Credit"]),
                                ReadOnly = Convert.ToBoolean(dr["ReadOnly"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int invoiceId, List<ARInvoiceDetail> details, string userId, DbTransaction transaction)
        {
            foreach (ARInvoiceDetail arid in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveARInvoiceDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "InvoiceId", SqlDbType.Int, invoiceId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, arid.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, arid.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, arid.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, arid.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, arid.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, arid.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, arid.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
