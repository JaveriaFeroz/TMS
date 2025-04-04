using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class APInvoiceDetail
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
        public APInvoiceDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<APInvoiceDetail> Get(int pivId)
        {
            List<APInvoiceDetail> details = new List<APInvoiceDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAPInvoiceDetailById"))
            {
                db.AddInParameter(dbCommand, "PIVId", SqlDbType.Int, pivId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new APInvoiceDetail
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

        internal static bool Save(int pivId, List<APInvoiceDetail> details, string userId, DbTransaction transaction)
        {
            foreach (APInvoiceDetail apid in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveAPInvoiceDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "PIVId", SqlDbType.VarChar, pivId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, apid.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, apid.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, apid.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, apid.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, apid.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, apid.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, apid.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}