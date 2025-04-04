using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Insurance.Models
{

    public class ___InsuranceStatus
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order=0)]
        public short InsuranceStatusId { get; set; }
        [DataMember(Order = 1)]
        public string InsuranceStatusName { get; set; }
        #endregion

        #region constructor
        public ___InsuranceStatus()
        {
        }

        public ___InsuranceStatus(short _insuranceStatusId, string _InsuranceStatusName)
        {
            InsuranceStatusId = _insuranceStatusId;
            InsuranceStatusName = _InsuranceStatusName;
        }
        #endregion

        #region internal methods
        internal static List<___InsuranceStatus> Get(bool _activeOnly = true)
        {
            List<___InsuranceStatus> lIT = new List<___InsuranceStatus>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getInsuranceStatuses"))
            {
                db.AddInParameter(dbCommand, "activeonly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ___InsuranceStatus il = new ___InsuranceStatus(
                                Convert.ToInt16(dr["InsuranceStatusId"]),
                                dr["InsuranceStatusName"].ToString());
                            lIT.Add(il);
                        }
                    }
                }
            }
            return lIT;
        }
        #endregion
    }
}
