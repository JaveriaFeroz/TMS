using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class CoAs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [Browsable(false)]
        public short AccountId { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public string AccountTypeName { get; set; }
        public string ParentAccountCode { get; set; }
        public string HFMCode { get; set; }
        [Browsable(false)]
        public short AccountTypeId { get; set; }
        [Browsable(false)]
        public short ParentAccountId { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public CoAs()
        {
        }
        #endregion

        #region public functions
        /// <summary>
        /// returns chart of accounts
        /// </summary>
        /// <param name="companyId">Company for which CoA is required</param>
        /// <param name="userId">User who is requesting CoA</param>
        /// <param name="activeOnly">Include only active account if this parater is set to true</param>
        /// <returns></returns>
        internal static List<CoAs> Get(short companyId, string userId, bool activeOnly = true )
        {
            List<CoAs> accounts = new List<CoAs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCoAs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accounts.Add(new CoAs
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                AccountCode = dr["AccountCode"].ToString(),
                                AccountName = dr["AccountName"].ToString(),
                                ParentAccountCode = dr["ParentAccountCode"].ToString(),
                                HFMCode = dr["HFMCode"].ToString(),
                                AccountTypeId = Convert.ToInt16(dr["AccountTypeId"]),
                                AccountTypeName = dr["AccountTypeName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return accounts;
        }

        internal static List<CoAs> GetBanks(short companyId, string userId, bool activeOnly = true)
        {
            List<CoAs> accounts = new List<CoAs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCoABanks"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accounts.Add(new CoAs
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                AccountName = dr["AccountName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return accounts;
        }

        /// <summary>
        /// returns chart of accounts for specific account type
        /// </summary>
        /// <param name="companyId">Company for which CoA is required</param>
        /// <param name="accountTypeId">Specific account type for which account listing is required</param>
        /// <param name="userId">User who is requesting CoA</param>
        /// <param name="activeOnly">Include only active account if this parater is set to true</param>
        /// <returns></returns>
        internal static List<CoAs> Get(short companyId, agEnums.AccountType accountTypeId, string userId, bool activeOnly = true)
        {
            List<CoAs> accounts = new List<CoAs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCoAsForAccountType"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "AccountTypeId", SqlDbType.TinyInt, accountTypeId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accounts.Add(new CoAs
                            {
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                AccountCode = dr["AccountCode"].ToString(),
                                AccountName = dr["AccountName"].ToString(),
                                ParentAccountId = Convert.ToInt16(dr["ParentAccountId"]),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return accounts;
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
