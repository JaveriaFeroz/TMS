using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JRDetail
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
        public bool ReadOnly { get; set; }
        #endregion

        #region constructor
        public JRDetail()
        {          
            
        }
        #endregion

        #region internal methods
        internal static List<JRDetail> Get(int voucherId)
        {
            List<JRDetail> details = new List<JRDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJRDetailById"))
            {
                db.AddInParameter(dbCommand, "VoucherId", SqlDbType.VarChar, voucherId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new JRDetail
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

        internal static bool Save(int voucherId, List<JRDetail> details, string userId, DbTransaction transaction)
        {
            foreach (JRDetail jrd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveJRDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "VoucherId", SqlDbType.Int, voucherId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, jrd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, jrd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, jrd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, jrd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, jrd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, jrd.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, jrd.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}