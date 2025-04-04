using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class JRs 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string VoucherNo { get; set; }
        public string VoucherDate { get; set; }
        public string ChequeNo { get; set; }
        //public string ChequeDate { get; set; }
        public string PayerName { get; set; }
        //public string Narration { get; set; }
        public string PeriodName { get; set; }
        public string SourceJRNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }

        #endregion

        #region constructor
        public JRs()
        {

        }
        #endregion

        #region internal functions
        internal static List<JRs> Get(short companyId, string userId)
        {
            List<JRs> receipts = new List<JRs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJRs"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            receipts.Add(new JRs
                            {
                                VoucherNo = dr["VoucherNo"].ToString(),
                                VoucherDate = dr["VoucherDate"].ToString(),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                PayerName = dr["PayerName"].ToString(),
                                //dr["Narration"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceJRNo = dr["SourceJRNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return receipts;
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
