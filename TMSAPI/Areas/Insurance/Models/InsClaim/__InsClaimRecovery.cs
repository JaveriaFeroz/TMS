using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;

namespace TMSAPI.Areas.Insurance.Models
{
    public class __InsClaimRecovery : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
      
        public double ClaimAmount { get; set; }
        public double MinDeductible { get; set; }
        public double AmountRecovered { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string BankDetail { get; set; }
        #endregion

        #region constructor
        public __InsClaimRecovery()
        {
            
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
