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
    public class PaymentModes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order=0)]
        public short PaymentModeId { get; set; }
        [DataMember(Order = 1)]
        public string PaymentModeName { get; set; }
        #endregion

        #region constructor
        public PaymentModes()
        {
        }
        #endregion

        #region internal methods
        internal static List<PaymentModes> Get(bool _activeOnly = true)
        {
            List<PaymentModes> modes = new List<PaymentModes>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetPaymentModes");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        modes.Add(new PaymentModes
                        {
                            PaymentModeId = Convert.ToInt16(dr["PaymentModeId"]),
                            PaymentModeName = dr["PaymentModeName"].ToString()
                        });
                    }
                }
            }
            return modes;
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
