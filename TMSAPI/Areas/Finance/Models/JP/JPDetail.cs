using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class JPDetail
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
        public JPDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<JPDetail> Get(int voucherId)
        {
            List<JPDetail> details = new List<JPDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJPDetailById"))
            {
                db.AddInParameter(dbCommand, "VoucherId", SqlDbType.VarChar, voucherId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new JPDetail
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

        internal static bool Save(int voucherId, List<JPDetail> details, string userId, DbTransaction transaction)
        {
            foreach (JPDetail jpd in details)
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveJPDetail"))
                {
                    db.AddInParameter(dbCommandDetail, "VoucherId", SqlDbType.Int, voucherId);
                    db.AddInParameter(dbCommandDetail, "AccountId", SqlDbType.SmallInt, jpd.AccountId);
                    db.AddInParameter(dbCommandDetail, "BranchId", SqlDbType.VarChar, jpd.BranchId);
                    db.AddInParameter(dbCommandDetail, "DepartmentId", SqlDbType.VarChar, jpd.DeptId);
                    db.AddInParameter(dbCommandDetail, "Description", SqlDbType.VarChar, jpd.Description);
                    db.AddInParameter(dbCommandDetail, "Debit", SqlDbType.Float, jpd.Debit);
                    db.AddInParameter(dbCommandDetail, "Credit", SqlDbType.Float, jpd.Credit);
                    db.AddInParameter(dbCommandDetail, "ReadOnly", SqlDbType.Bit, jpd.ReadOnly);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}