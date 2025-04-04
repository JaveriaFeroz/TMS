using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Insurance.Models
{
    public class ___PaymentType
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order=0)]
        public short PaymentTypeId { get; set; }
        [DataMember(Order = 1)]
        public string PaymentTypeName { get; set; }
        #endregion

        #region constructor
        public ___PaymentType()
        {
        }

        public ___PaymentType(short _PaymentTypeId, string _PaymentTypeName)
        {
            PaymentTypeId = _PaymentTypeId;
            PaymentTypeName = _PaymentTypeName;
        }
        #endregion

        #region internal mehtods
        internal static List<___PaymentType> Get()
        {
            List<___PaymentType> lIT = new List<___PaymentType>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getPaymentTypes"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ___PaymentType il = new ___PaymentType(
                                Convert.ToInt16(dr["PaymentTypeId"]),
                                dr["PaymentTypeName"].ToString());
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
