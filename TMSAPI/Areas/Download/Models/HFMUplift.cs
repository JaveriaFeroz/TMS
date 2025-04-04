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
    public class HFMUplift
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string HFMCode { get; set; }        
        public string ICPCode { get; set; }       
        public string PL { get; set; }
        public decimal Closing { get; set; }


        #endregion

        #region constructor
        public HFMUplift()
        {
        }

        public HFMUplift(string _HFMCode, string _ICPCode, string _PL, decimal _Closing)
        {
            HFMCode = _HFMCode;
            ICPCode = _ICPCode;
            PL = _PL;
            Closing = _Closing;
        }
        #endregion

        #region internal methods
        internal static List<HFMUplift> Get(string dateupto, short companyid)
        {
            try
            {
                List<HFMUplift> lstSVR = new List<HFMUplift>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("extPendingServiceRequest"))
                {

                    db.AddInParameter(dbCommand, "DateUpTo", SqlDbType.DateTime, DateTime.ParseExact(dateupto, "ddMMyyyy", CultureInfo.CurrentCulture));

                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyid);
                    using DataSet ds = db.ExecuteDataSet(dbCommand);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            HFMUplift ico = new HFMUplift(
                                dr["Assetno"].ToString(),
                                  dr["ICPCode"].ToString(),
                                dr["PL"].ToString(),
                                 Convert.ToDecimal(dr["Closing"]));
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