using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class JPs
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string VoucherNo { get; set; }
        public string VoucherDate { get; set; }
        public string ChequeNo { get; set; }
        public string PayeeName { get; set; }
        public string PeriodName { get; set; }
        public string SourceJPNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public JPs()
        {

        }
        #endregion

        #region internal methods
        internal static List<JPs> Get(short companyId, string userId)
        {
            List<JPs> payments = new List<JPs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJPs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            payments.Add(new JPs
                            {
                                VoucherNo = dr["VoucherNo"].ToString(),
                                VoucherDate = dr["VoucherDate"].ToString(),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                PayeeName = dr["PayeeName"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceJPNo = dr["SourceJPNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return payments;
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
