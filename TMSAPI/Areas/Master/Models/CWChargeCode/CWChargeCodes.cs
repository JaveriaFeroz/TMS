using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class CWChargeCodes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember (Order=0)]
        public string ChargeCode{ get; set; }
        [DataMember(Order = 1)]
        public string ChargeName { get; set; }
        #endregion

        #region constructor
        public CWChargeCodes()
        {
        }
        #endregion

        #region internal methods
        internal static List<CWChargeCodes> Get()
        {
            List<CWChargeCodes> chargecodes = new List<CWChargeCodes>();

            DbCommand dbCommand = db.GetStoredProcCommand("GetCWChargeCodes");
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        chargecodes.Add(new CWChargeCodes
                        {
                            ChargeCode = dr["ChargeCode"].ToString(),
                            ChargeName = dr["ChargeName"].ToString()
                        });
                    }
                }
            }
            return chargecodes;
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
