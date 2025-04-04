using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class PaymentInstruments : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short InstrumentId { get; set; }
        public string InstrumentName { get; set; }
        #endregion

        #region constructor
        public PaymentInstruments()
        {
        }
        #endregion

        #region internal methods
        internal static List<PaymentInstruments> Get(bool _activeOnly = true)
        {
            List<PaymentInstruments> instruments = new List<PaymentInstruments>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPaymentInstruments"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            instruments.Add(new PaymentInstruments
                            {
                                InstrumentId = Convert.ToInt16(dr["InstrumentId"]),
                                InstrumentName = dr["InstrumentName"].ToString()
                            });
                        }
                    }
                }
            }
            return instruments;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}