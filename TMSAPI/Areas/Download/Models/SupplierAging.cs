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
    public class SupplierAging
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string SupplierName { get; set; }
        public short CreditDays { get; set; }
        public decimal NotYetdue { get; set; }
        public decimal OverDue1To15 { get; set; }
        public decimal OverDue16To30 { get; set; }
        public decimal OverDue31To60 { get; set; }
        public decimal OverDue61To90 { get; set; }
        public decimal OverDue91To120 { get; set; }
        public decimal OverDueAbove120 { get; set; }
        #endregion

        #region constructor
        public SupplierAging()
        {
        }

        public SupplierAging(string _SupplierName, short _CreditDays, decimal _NotYetdue,
            decimal _OverDue1To15, decimal _OverDue16To30, decimal _OverDue31To60, decimal _OverDue61To90,
             decimal _OverDue91To120, decimal _OverDueAbove120)
        {
            SupplierName = _SupplierName;
            CreditDays = _CreditDays;
            NotYetdue = _NotYetdue;
            OverDue1To15 = _OverDue1To15;
            OverDue16To30 = _OverDue16To30;
            OverDue31To60 = _OverDue31To60;
            OverDue61To90 = _OverDue61To90;
            OverDue91To120 = _OverDue91To120;
            OverDueAbove120 = _OverDueAbove120;
        }
        #endregion

        #region internal methods
        internal static List<SupplierAging> Get(DateTime dateupto, short companyid)
        {
            try
            {
                List<SupplierAging> lstSVR = new List<SupplierAging>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("extSupplierAging"))
                {

                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyid);
                    db.AddInParameter(dbCommand, "DateUpTo", SqlDbType.DateTime, dateupto);                   
                    using DataSet ds = db.ExecuteDataSet(dbCommand);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            SupplierAging ico = new SupplierAging(
                                 dr["SupplierName"].ToString(),
                                 Convert.ToInt16(dr["CreditDays"]),
                                Convert.ToDecimal(dr["NotYetdue"]),
                                Convert.ToDecimal(dr["OverDue1To15"]),
                                Convert.ToDecimal(dr["OverDue16To30"]),
                                Convert.ToDecimal(dr["OverDue31To60"]),
                                Convert.ToDecimal(dr["OverDue61To90"]),
                                Convert.ToDecimal(dr["OverDue91To120"]),
                                Convert.ToDecimal(dr["OverDueAbove120"]));
                            lstSVR.Add(ico);
                        }
                    }
                }
                return lstSVR;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}