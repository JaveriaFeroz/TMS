using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JournalVoucherDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        public short? AccountId { get; set; }
        public string BranchCode { get; set; }
        public string DepartmentCode { get; set; }
        public short? ClientId { get; set; }
        public string Description { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        //public bool Add { get; set; }
        //public bool Edit { get; set; }
        //public bool Delete { get; set; }
        #endregion

        #region constructor
        public JournalVoucherDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<JournalVoucherDetail> Get(int voucherId)
        {
            List<JournalVoucherDetail> details = new List<JournalVoucherDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJournalVoucherDetailByNo"))
            {
                db.AddInParameter(dbCommand, "VoucherId", SqlDbType.VarChar, voucherId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new JournalVoucherDetail
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                BranchCode = dr["BranchCode"].ToString(),
                                DepartmentCode = dr["DepartmentCode"].ToString(),
                                ClientId = agHelper.sDBNull(dr["ClientId"]),
                                Description = dr["Description"].ToString(),
                                Debit = Convert.ToDouble(dr["Debit"]),
                                Credit = Convert.ToDouble(dr["Credit"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int voucherId, List<JournalVoucherDetail> details, string userId, DbTransaction transaction)
        {
            foreach (JournalVoucherDetail jvd in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveJournalVoucherDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "VoucherId", SqlDbType.Int, voucherId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, jvd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchCode", SqlDbType.VarChar, jvd.BranchCode);
                    db.AddInParameter(dbCommandDetail, "DepartmentCode", SqlDbType.VarChar, jvd.DepartmentCode);
                    db.AddInParameter(dbCommandDetail, "ClientId", SqlDbType.SmallInt, jvd.ClientId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, jvd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, jvd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, jvd.Credit);
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
