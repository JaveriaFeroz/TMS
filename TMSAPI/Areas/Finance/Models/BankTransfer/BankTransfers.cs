using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class BankTransfers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string TransferNo { get; set; }
        public string TransferDate { get; set; }
        public string InstrumentName { get; set; }
        public string ChequeNo { get; set; }
        public string PeriodName { get; set; }
        public string SourceTransferNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public BankTransfers()
        {

        }
        #endregion

        #region internal methods
        internal static List<BankTransfers> Get(short companyId, string userId)
        {
            List<BankTransfers> transfers = new List<BankTransfers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetBankTransfers"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            transfers.Add(new BankTransfers
                            {
                                TransferNo = dr["TransferNo"].ToString(),
                                TransferDate = dr["TransferDate"].ToString(),
                                InstrumentName = dr["InstrumentName"].ToString(),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourceTransferNo = dr["SourceTransferNo"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString()
                            });
                        }
                    }
                }
            }
            return transfers;
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