using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class JournalVouchers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string VoucherNo { get; set; }       
        public string VoucherDate { get; set; }      
        public string Narration { get; set; }
        public string PeriodName { get; set; }
        public string SourceVoucherNo { get; set; }
        #endregion

        #region constructor
        public JournalVouchers()
        {

        }
        #endregion

        #region internal methods
        internal static List<JournalVouchers> Get(short companyId)
        {
            List<JournalVouchers> vouchers = new List<JournalVouchers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJournalVouchers"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            vouchers.Add(new JournalVouchers
                            {
                                VoucherNo = dr["VoucherNo"].ToString(),
                                VoucherDate = dr["VoucherDate"].ToString(),
                                Narration = dr["Narration"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceVoucherNo = dr["SourceVoucherNo"].ToString()
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
