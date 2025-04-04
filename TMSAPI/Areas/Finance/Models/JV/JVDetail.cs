using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JVDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        public short? AccountId { get; set; }
        public short? BranchId { get; set; }
        public short? DeptId { get; set; }
        //public short? ClientId { get; set; }
        public string Description { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        #endregion

        #region constructor
        public JVDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<JVDetail> Get(int voucherId)
        {
            List<JVDetail> details = new List<JVDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJVDetailById"))
            {
                db.AddInParameter(dbCommand, "VoucherId", SqlDbType.Int, voucherId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new JVDetail
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                BranchId = agHelper.sDBNull(dr["BranchId"]),
                                DeptId = agHelper.sDBNull(dr["DepartmentId"]),
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

        internal static bool Save(int voucherId, List<JVDetail> details, string userId, DbTransaction transaction)
        {
            foreach (JVDetail jvd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveJVDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "VoucherId", SqlDbType.Int, voucherId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, jvd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, jvd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, jvd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, jvd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, jvd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, jvd.Credit);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
