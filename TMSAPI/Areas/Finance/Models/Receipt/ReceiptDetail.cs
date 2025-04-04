using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ReceiptDetail
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
        public ReceiptDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<ReceiptDetail> Get(int receiptId)
        {
            List<ReceiptDetail> details = new List<ReceiptDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetReceiptDetailById"))
            {
                db.AddInParameter(dbCommand, "ReceiptId", SqlDbType.Int, receiptId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new ReceiptDetail
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

        internal static bool Save(int receiptId, List<ReceiptDetail> details, DbTransaction transaction)
        {
            foreach (ReceiptDetail rd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveReceiptDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "ReceiptId", SqlDbType.Int, receiptId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, rd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, rd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, rd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, rd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, rd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, rd.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, rd.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
