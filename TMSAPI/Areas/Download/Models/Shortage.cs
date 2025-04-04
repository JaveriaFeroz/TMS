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
    public class Shortage
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public string JobCloseDate { get; set; }
        public string RWBNo { get; set; }
        public string JobNo { get; set; }        
        public string CustomerOrderNo { get; set; }
        public string GatePassNo { get; set; }
        public string ShipperName { get; set; }
        public string AssetNo { get; set; }
        public string ConsigneeName { get; set; }
        public string CapacityName { get; set; }
        public short ShortageQuantity { get; set; }
        public decimal ShortageAmount { get; set; }
        //public string ClientName { get; set; }
        public string Period { get; set; }
        #endregion

        #region constructor
        public Shortage()
        {
        }

        public Shortage(string _JobCloseDate, string _RWBNoNo, string _JobNo, string _CustomerOrderNo,
            string _GatePassNo, string _ShipperName, string _AssetNo, short _ShortageQuantity,
             decimal _ShortageAmount, string _ConsigneeName, string _CapacityName, string _Period)
        {
            JobCloseDate = _JobCloseDate;
            RWBNo = _RWBNoNo;
            JobNo = _JobNo;
            CustomerOrderNo = _CustomerOrderNo;
            GatePassNo = _GatePassNo;
            ShipperName = _ShipperName;
            AssetNo = _AssetNo;
            ShortageQuantity = _ShortageQuantity;
            ShortageAmount = _ShortageAmount;
            ConsigneeName = _ConsigneeName;
            CapacityName = _CapacityName;
            //--ClientName = _ClientName;
            Period = _Period;

        }
        #endregion

        #region internal methods
        internal static List<Shortage> Get(short PeriodFrom, short PeriodTo, short clientId, short assetId, short companyid, string userId)
        {
            try
            {
                List<Shortage> lstSVR = new List<Shortage>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("extShortage"))
                {
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                    db.AddInParameter(dbCommand, "PeriodFrom", SqlDbType.SmallInt, PeriodFrom);
                    db.AddInParameter(dbCommand, "PeriodTo", SqlDbType.SmallInt, PeriodTo);
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyid);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using DataSet ds = db.ExecuteDataSet(dbCommand);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            Shortage ico = new Shortage(
                                dr["JobClosureDate"].ToString(),
                                dr["RwbNo"].ToString(), 
                                dr["JobNo"].ToString(),
                                dr["CustomerOrderNo"].ToString(),
                                dr["GatePassNo"].ToString(),
                                dr["ClientName"].ToString(),
                                dr["AssetNo"].ToString(),
                                Convert.ToInt16(dr["ShortageQuantity"]),
                                Convert.ToDecimal(dr["ShortageAmount"]),
                                dr["ConsigneeName"].ToString(),
                                dr["CapacityName"].ToString(),
                                dr["PeriodName"].ToString());
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