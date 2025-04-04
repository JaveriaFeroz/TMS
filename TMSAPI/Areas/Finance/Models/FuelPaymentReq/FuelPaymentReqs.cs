using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class FuelPaymentReqs 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short RequestId { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string PaymentTypeName { get; set; }
        public string CardNo { get; set; }
        public string SupplierName { get; set; }
        #endregion

        #region constructor
        public FuelPaymentReqs()
        {
        }
        #endregion

        #region internal methods
        internal static List<FuelPaymentReqs> Get(short companyId, string userId)
        {
            List<FuelPaymentReqs> requests = new List<FuelPaymentReqs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelPaymentRequests"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            requests.Add(new FuelPaymentReqs
                            {
                                RequestId = Convert.ToInt16(dr["RequestId"]),
                                PaymentTypeName = dr["PaymentTypeName"].ToString(),
                                DateFrom = dr["DateFrom"].ToString(),
                                DateTo = dr["DateTo"].ToString(),
                                CardNo = dr["CardNo"].ToString(),
                                SupplierName = dr["SupplierName"].ToString()
                            });
                        }
                    }
                }
            }
            return requests;
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
