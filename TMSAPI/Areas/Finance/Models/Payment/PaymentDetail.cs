using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class PaymentDetail
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
        public PaymentDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<PaymentDetail> Get(int PYId)
        {
            List<PaymentDetail> details = new List<PaymentDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPaymentDetailById"))
            {
                db.AddInParameter(dbCommand, "PYId", SqlDbType.VarChar, PYId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new PaymentDetail
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

        internal static bool Save(int pyId, List<PaymentDetail> details, DbTransaction transaction)
        {
            foreach (PaymentDetail pd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SavePaymentDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "PYId", SqlDbType.Int, pyId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, pd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, pd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, pd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, pd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, pd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, pd.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, pd.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
