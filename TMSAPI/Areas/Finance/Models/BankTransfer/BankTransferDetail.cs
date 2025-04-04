using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class BankTransferDetail
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
        public BankTransferDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<BankTransferDetail> Get(int transferId)
        {
            List<BankTransferDetail> details = new List<BankTransferDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetBankTransferDetailById"))
            {
                db.AddInParameter(dbCommand, "TransferId", SqlDbType.Int, transferId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new BankTransferDetail
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

        internal static bool Save(int transferId, List<BankTransferDetail> details, string userId, DbTransaction transaction)
        {
            foreach (BankTransferDetail btd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveBankTransferDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, transferId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, btd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, btd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, btd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, btd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, btd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, btd.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, btd.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
