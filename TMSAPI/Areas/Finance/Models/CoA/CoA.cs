using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CoA : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string AccountCode { get; set; }
        public short? ParentAccountId { get; set; }       
        public string AccountName { get; set; }
        public short? AccountTypeId { get; set; }
        public string HFMCode { get; set; }
        public decimal? OPBalance { get; set; }
        public DateTime? OPBalanceDate { get; set; }
        public string Remarks { get; set; }
        public bool IsActive { get; set; }
        //display field only
        public string Hierarchy { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        //public string Level2 { get; set; }
        //public string Level3 { get; set; }
        //public string Level4{ get; set; }
        #endregion

        #region constructor
        public CoA()
        {
        }
        #endregion

        #region internal methods
        internal static CoA Get(string accountCode, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCoAById"))
            {
                db.AddInParameter(dbCommand, "AccountCode", SqlDbType.VarChar, accountCode);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new CoA
                        {
                            AccountCode = accountCode,
                            ParentAccountId = agHelper.sDBNull(dr["ParentAccountId"]),
                            AccountName = dr["AccountName"].ToString(),
                            HFMCode = dr["HFMCode"].ToString(),
                            AccountTypeId = Convert.ToInt16(dr["AccountTypeId"]),
                            OPBalance = Convert.ToDecimal(dr["OpBalance"]),
                            OPBalanceDate = Convert.ToDateTime(dr["OpBalanceDate"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Hierarchy = dr["Hierarchy"].ToString(),
                            Remarks = dr["Remarks"].ToString(),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static string GetHierarchy(string accountCode, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("dbo.udfCoAHierarchy"))
            {
                db.AddInParameter(dbCommand, "AccountCode", SqlDbType.VarChar, accountCode);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        return ds.Tables[0].Rows[0]["Hierarchy"].ToString();
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(CoA c, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCoA"))
                {
                    db.AddInParameter(dbCommand, "AccountCode", SqlDbType.VarChar, c.AccountCode);
                    db.AddInParameter(dbCommand, "ParentAccountId", SqlDbType.SmallInt, c.ParentAccountId);
                    db.AddInParameter(dbCommand, "AccountName", SqlDbType.VarChar, c.AccountName);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, c.Remarks);
                    db.AddInParameter(dbCommand, "HFMCode", SqlDbType.VarChar, c.HFMCode);
                    db.AddInParameter(dbCommand, "AccountTypeId", SqlDbType.SmallInt, c.AccountTypeId);
                    db.AddInParameter(dbCommand, "OpBalance", SqlDbType.Decimal, c.OPBalance);
                    db.AddInParameter(dbCommand, "OpBalanceDate", SqlDbType.DateTime, c.OPBalanceDate);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.SmallInt, c.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
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