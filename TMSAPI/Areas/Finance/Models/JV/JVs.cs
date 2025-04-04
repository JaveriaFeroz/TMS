using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class JVs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string VoucherNo { get; set; }       
        public string VoucherDate { get; set; }      
        public string PeriodName { get; set; }
        public string SourceVoucherNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public JVs()
        {

        }
        #endregion

        #region internal methods
        internal static List<JVs> Get(short companyId, string userId)
        {
            List<JVs> vouchers = new List<JVs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJVs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            vouchers.Add(new JVs
                            {
                                VoucherNo = dr["VoucherNo"].ToString(),
                                VoucherDate = dr["VoucherDate"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceVoucherNo = dr["SourceVoucherNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return vouchers;
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
