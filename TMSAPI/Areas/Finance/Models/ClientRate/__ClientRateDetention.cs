using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Linq;

namespace TMSAPI.Areas.Finance.Models
{
    //this class to be deleted
    public class __ClientRateDetention
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public int? DetailId { get; set; }
        public string EffectiveDate { get; set; }       
        public string DetentionChargeTime { get; set; }
        public string ReportingTime { get; set; }
        public double DetentionCharges { get; set; }      
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region constructor
        public __ClientRateDetention()
        {
            DetailId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public __ClientRateDetention(int _detailId, int _CDetailId, string _EffectiveDate, string _DetentionChargeTime, string _ReportingTime, double _DetentionCharges)
        {
            DetailId = _detailId;
            CDetailId = _CDetailId;
            EffectiveDate = _EffectiveDate;
            DetentionChargeTime = _DetentionChargeTime;
            ReportingTime = _ReportingTime;
            DetentionCharges = _DetentionCharges;
            Add = false; Edit = false; Delete = false;
        }
        #endregion

        #region internal methods
        internal static List<__ClientRateDetention> Get(short ClientId)
        {
            List<__ClientRateDetention> lstAD = new List<__ClientRateDetention>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_DetentionByTime"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ClientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new __ClientRateDetention(0,
                                Convert.ToInt32(dr["DetailId"]),                                
                                    dr["EffectiveDate"].ToString(),
                                     dr["DetentionChargeTime"].ToString(),
                                    dr["ReportingTime"].ToString(),
                                     Convert.ToDouble(dr["DetentionCharges"])));
                        }
                    }
                }
            }
            return lstAD;
        }

        internal static List<__ClientRateDetention> GetFormClient(short formid)
        {
            List<__ClientRateDetention> lstAD = new List<__ClientRateDetention>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRate_DetentionByTime"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new __ClientRateDetention(Convert.ToInt32(dr["DetailId"]),
                                Convert.ToInt32(dr["CDetailId"]),
                                    dr["EffectiveDate"].ToString(),
                                     dr["DetentionChargeTime"].ToString(),
                                    dr["ReportingTime"].ToString(),
                                     Convert.ToDouble(dr["DetentionCharges"])));
                        }
                    }
                }
            }
            return lstAD;
        }

        internal static bool Save(short _FormId, short _ClientId, short _RateTypeId, List<__ClientRateDetention> details, string userId, DbTransaction transaction)
        {
            
            foreach (__ClientRateDetention iad in getIADetailChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRates_DetentionByTime"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _FormId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, iad.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.SmallInt, iad.CDetailId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _ClientId);
                    db.AddInParameter(dbCommand, "EffectiveDate", SqlDbType.DateTime, DateTime.ParseExact(iad.EffectiveDate, "dd/MM/yyyy", CultureInfo.CurrentCulture));  
                    db.AddInParameter(dbCommand, "DetentionChargeTime", SqlDbType.DateTime, DateTime.ParseExact(iad.DetentionChargeTime, "HH:mm", CultureInfo.CurrentCulture));  
                    db.AddInParameter(dbCommand, "ReportingTime", SqlDbType.DateTime, DateTime.ParseExact(iad.ReportingTime, "HH:mm", CultureInfo.CurrentCulture)); 
                    db.AddInParameter(dbCommand, "DetentionCharges", SqlDbType.Float, iad.DetentionCharges);

                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          iad.Delete ? "D" : (iad.Add ? "I" : "U")));

                    db.ExecuteNonQuery(dbCommand, transaction);

                }
            }
            return true;
        }
        #endregion

        #region private methods
        private static IEnumerable<__ClientRateDetention> getIADetailChanges(List<__ClientRateDetention> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}
