using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Download.Models
{
    [DataContract]
    public class CreditFuel
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string SlipDate { get; set; }
        public string SlipNo { get; set; }
        public string ClientName{ get; set; }
        public string JobNo{ get; set; }
        public string StateName { get; set; }
        public string AssetNo{ get; set; }
        public short Litre{ get; set; }
        public decimal Amount{ get; set; }
        public string SupplierName{ get; set; }
        #endregion

        #region constructor
        public CreditFuel()
        {
        }

        #endregion

        #region internal methods
        internal static List<CreditFuel> Get(DateTime dateFrom, DateTime dateTo, short clientId, short supplierid, short companyid, string userId)
        {
            try
            {
                List<CreditFuel> details = new List<CreditFuel>();
                DbCommand dbCommand = db.GetStoredProcCommand("extCreditFuel");               
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                db.AddInParameter(dbCommand, "SlipDateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "SlipDateTo", SqlDbType.DateTime, dateTo);
                //db.AddInParameter(dbCommand, "SlipDateFrom", SqlDbType.DateTime, DateTime.ParseExact(dateFrom, "ddMMyyyy", CultureInfo.CurrentCulture));
                //db.AddInParameter(dbCommand, "SlipDateTo", SqlDbType.DateTime, DateTime.ParseExact(dateTo, "ddMMyyyy", CultureInfo.CurrentCulture));
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierid);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyid);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new CreditFuel
                            {
                                SlipDate = dr["SlipDate"].ToString(),
                                SlipNo = dr["SlipNo"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                JobNo = dr["JobNo"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                Litre = Convert.ToInt16(dr["Qty"]),
                                Amount = Convert.ToDecimal(dr["Amount"]),
                                SupplierName = dr["SupplierName"].ToString()
                            });
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }
       
        #endregion
    }
}