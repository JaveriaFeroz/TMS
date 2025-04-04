using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsCompany : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? CompanyId { get; set; }
        public string CompanyName { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InsCompany()
        {
        }
        #endregion

        #region internal methods
        internal static InsCompany Get(short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsCompanyById"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.Int, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InsCompany
                        {
                            CompanyId = Convert.ToInt16(dr["CompanyId"]),
                            CompanyName = dr["CompanyName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InsCompany ic, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsCompany"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.Int, ic.CompanyId);
                    db.AddInParameter(dbCommand, "CompanyName", SqlDbType.VarChar, ic.CompanyName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, ic.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ic.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception) { throw; }
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