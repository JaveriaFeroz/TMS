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
    public class ___ClientRateFixedPerTripPlusPerKM
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public string Effectivedate { get; set; }
        public short PerKM { get; set; }
        public short Vehicletypeid { get; set; }        
        public double? Pertripcharges { get; set; }
        public double? Rateperkm { get; set; }        
        public double Loadingcharges { get; set; }
        public double Offloadingcharges { get; set; }
        public double? Detentionupto24hours { get; set; }
        public double? Detention25to48hours { get; set; }
        public double? Detentionafter48hours { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region constructor
        public ___ClientRateFixedPerTripPlusPerKM()
        {
            DetailId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public ___ClientRateFixedPerTripPlusPerKM(int _detailId, int _CDetailId,   string _effectivedate,  short _perKM, short _vehicletypeid,
                 double _perTripCharge, double _ratePerKM, double _loadingChgs, double _offloadingChgs,
                 double _detentionupto24hours, double _detention25to48hours, double _detentionafter48hours)
        {
            DetailId = _detailId;
            CDetailId = _CDetailId;
            Effectivedate = _effectivedate;
            PerKM = _perKM;
            Vehicletypeid = _vehicletypeid;           
            Pertripcharges = _perTripCharge;
            Rateperkm = _ratePerKM;
            Loadingcharges = _loadingChgs;
            Offloadingcharges = _offloadingChgs;
            Detentionupto24hours = _detentionupto24hours;
            Detention25to48hours = _detention25to48hours;
            Detentionafter48hours = _detentionafter48hours;
            Add = false; Edit = false; Delete = false;
        }
        #endregion

        #region internal methods
        internal static List<___ClientRateFixedPerTripPlusPerKM> Get(short ClientId)
        {
            List<___ClientRateFixedPerTripPlusPerKM> lstAD = new List<___ClientRateFixedPerTripPlusPerKM>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getClientRate_FixedPerTripPlusPerKM"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ClientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new ___ClientRateFixedPerTripPlusPerKM(0,
                                Convert.ToInt32(dr["DetailId"]),
                               dr["Effectivedate"].ToString(),
                                  Convert.ToInt16(dr["PerKM"]),
                                  Convert.ToInt16(dr["VehicleTypeId"]),
                                    Convert.ToDouble(dr["Pertripcharges"]),
                                     Convert.ToDouble(dr["Rateperkm"]),
                                     Convert.ToDouble(dr["Loadingcharges"]),
                                        Convert.ToDouble(dr["Offloadingcharges"]),
                                           Convert.ToDouble(dr["Detentionupto24hours"]),
                                           Convert.ToDouble(dr["Detention25to48hours"]),
                                              Convert.ToDouble(dr["Detentionafter48hours"])));
                        }
                    }
                }
            }
            return lstAD;
        }

        internal static List<___ClientRateFixedPerTripPlusPerKM> GetFormClient(short formid)
        {
            List<___ClientRateFixedPerTripPlusPerKM> lstAD = new List<___ClientRateFixedPerTripPlusPerKM>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getRate_FixedPerTripPlusPerKM"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new ___ClientRateFixedPerTripPlusPerKM(Convert.ToInt32(dr["DetailId"]),
                                Convert.ToInt32(dr["CDetailId"]),
                               dr["Effectivedate"].ToString(),
                                  Convert.ToInt16(dr["PerKM"]),
                                  Convert.ToInt16(dr["VehicleTypeId"]),
                                    Convert.ToDouble(dr["Pertripcharges"]),
                                     Convert.ToDouble(dr["Rateperkm"]),
                                     Convert.ToDouble(dr["Loadingcharges"]),
                                        Convert.ToDouble(dr["Offloadingcharges"]),
                                           Convert.ToDouble(dr["Detentionupto24hours"]),
                                           Convert.ToDouble(dr["Detention25to48hours"]),
                                              Convert.ToDouble(dr["Detentionafter48hours"])));
                        }
                    }
                }
            }
            return lstAD;
        }

        internal static bool Save(short _FormId, short _ClientId, short _RateTypeId, List<___ClientRateFixedPerTripPlusPerKM> details, string userId, DbTransaction transaction)
        {
            
            foreach (___ClientRateFixedPerTripPlusPerKM iad in getIADetailChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRates_FixedPerTripPlusPerKM"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _FormId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, iad.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.SmallInt, iad.CDetailId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _ClientId);
                    db.AddInParameter(dbCommand, "RateType", SqlDbType.TinyInt, _RateTypeId);
                    db.AddInParameter(dbCommand, "Effectivedate", SqlDbType.DateTime, DateTime.ParseExact(iad.Effectivedate, "dd/MM/yyyy", CultureInfo.InvariantCulture)); 
                    db.AddInParameter(dbCommand, "PerKM", SqlDbType.TinyInt, iad.PerKM);
                    db.AddInParameter(dbCommand, "VehicleTypeId", SqlDbType.SmallInt, iad.Vehicletypeid);
                    db.AddInParameter(dbCommand, "Pertripcharges", SqlDbType.Float, iad.Pertripcharges);
                    db.AddInParameter(dbCommand, "Rateperkm", SqlDbType.Float, iad.Rateperkm);
                    db.AddInParameter(dbCommand, "Loadingcharges", SqlDbType.Float, iad.Loadingcharges);
                    db.AddInParameter(dbCommand, "Offloadingcharges", SqlDbType.Float, iad.Offloadingcharges);
                    db.AddInParameter(dbCommand, "Detentionupto24hours", SqlDbType.Float, iad.Detentionupto24hours);
                    db.AddInParameter(dbCommand, "Detention25to48hours", SqlDbType.Float, iad.Detention25to48hours);
                    db.AddInParameter(dbCommand, "Detentionafter48hours", SqlDbType.Float, iad.Detentionafter48hours);

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
        private static IEnumerable<___ClientRateFixedPerTripPlusPerKM> getIADetailChanges(List<___ClientRateFixedPerTripPlusPerKM> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}
