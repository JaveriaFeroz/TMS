using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class Payments
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string PYNo { get; set; }
        public string PYDate { get; set; }
        public string SupplierName { get; set; }
        public string ChequeNo { get; set; }
        public double Amount { get; set; }
        public string PeriodName { get; set; }
        public string SourcePYNo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public Payments()
        {
        }
        #endregion

        #region internal functions
        internal static List<Payments> Get(short companyId, string userId)
        {
            List<Payments> payments = new List<Payments>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPayments"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            payments.Add(new Payments
                            {
                                PYNo = dr["PYNo"].ToString(),
                                PYDate = dr["PYDate"].ToString(),
                                SupplierName = dr["SupplierName"].ToString(),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                SourcePYNo = dr["SourcePYNo"].ToString(),
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
