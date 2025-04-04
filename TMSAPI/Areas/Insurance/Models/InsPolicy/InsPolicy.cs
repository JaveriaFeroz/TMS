using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsPolicy : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? PolicyId { get; set; }
        public string PolicyNo { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public short? InsCompanyId { get; set; }
        public short? CompanyId { get; set; }
        public bool IsActive { get; set; }
        public List<InsPolicyAsset> Assets { get; set; } = new List<InsPolicyAsset>();
        public agFooter Footer { get; set; }
        #endregion

        #region constructor
        public InsPolicy()
        {
        }
        #endregion

        #region internal methods
        internal static InsPolicy Get(short policyId, string userId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsPolicyById"))
            {
                db.AddInParameter(dbCommand, "PolicyId", SqlDbType.Int, policyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InsPolicy
                        {
                            PolicyId = policyId,
                            PolicyNo = dr["PolicyNo"].ToString(),
                            FromDate = Convert.ToDateTime(dr["FromDate"]),
                            ToDate = Convert.ToDateTime(dr["ToDate"]),
                            InsCompanyId = Convert.ToInt16(dr["InsCompanyId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Assets = InsPolicyAsset.Get(policyId),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InsPolicy ip, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsPolicy"))
                {
                    db.AddInParameter(dbCommand, "PolicyId", SqlDbType.SmallInt, ip.PolicyId);
                    db.AddInParameter(dbCommand, "PolicyNo", SqlDbType.VarChar, ip.PolicyNo);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, ip.FromDate);
                    db.AddInParameter(dbCommand, "ToDate", SqlDbType.DateTime, ip.ToDate);
                    db.AddInParameter(dbCommand, "InsCompanyId", SqlDbType.Int, ip.InsCompanyId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, ip.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ip.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "NewPolicyId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    ip.PolicyId = Convert.ToInt16(dbCommand.Parameters["@NewPolicyId"].Value);
                    InsPolicyAsset.Save(ip.PolicyId.Value, ip.Assets, userId, transaction);
                    transaction.Commit();
                }
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}