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
    public class ___ClientRateDeliveryTonnage
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CDetailId { get; set; }
        public int? DetailId { get; set; }
        public string Effectivedate { get; set; }
        public short? VehicleTypeId { get; set; }
        public short RouteId { get; set; }
        public double? Distance { get; set; }
        public double? Rate { get; set; }
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
        public ___ClientRateDeliveryTonnage()
        {
            DetailId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public ___ClientRateDeliveryTonnage(int _detailId, int _CdetailId, string _Effectivedate,  short _VehicleTypeId, short _RouteId,
                 double _Distance, double _Rate, double _Loadingcharges, double _Offloadingcharges,
                 double _Detentionupto24hours, double _Detention25to48hours, double _Detentionafter48hours)
        {
            DetailId = _detailId;
            CDetailId = _CdetailId;
            Effectivedate = _Effectivedate;
        
            VehicleTypeId = _VehicleTypeId;
            RouteId = _RouteId;
            Distance = _Distance;
            Rate = _Rate;
            Loadingcharges = _Loadingcharges;
            Offloadingcharges = _Offloadingcharges;
            Detentionupto24hours = _Detentionupto24hours;
            Detention25to48hours = _Detention25to48hours;
            Detentionafter48hours = _Detentionafter48hours;
        }
        #endregion

        #region internal methods
        internal static List<___ClientRateDeliveryTonnage> Get(short ClientId)
        {
            List<___ClientRateDeliveryTonnage> lstAD = new List<___ClientRateDeliveryTonnage>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRate_ChargeOnDeliveryTonnage"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ClientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new ___ClientRateDeliveryTonnage(0,
                                Convert.ToInt32(dr["DetailId"]),
                                dr["Effectivedate"].ToString(),
                            
                                  Convert.ToInt16(dr["VehicleTypeId"]),
                                  Convert.ToInt16(dr["RouteId"]),
                                    Convert.ToDouble(dr["Distance"]),
                                    Convert.ToDouble(dr["Rate"]),
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

        internal static List<___ClientRateDeliveryTonnage> GetFormClient(short formid)
        {
            List<___ClientRateDeliveryTonnage> lstAD = new List<___ClientRateDeliveryTonnage>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRate_ChargeOnDeliveryTonnage"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new ___ClientRateDeliveryTonnage(Convert.ToInt32(dr["DetailId"]),
                                Convert.ToInt32(dr["CDetailId"]),
                                dr["Effectivedate"].ToString(),

                                  Convert.ToInt16(dr["VehicleTypeId"]),
                                  Convert.ToInt16(dr["RouteId"]),
                                    Convert.ToDouble(dr["Distance"]),
                                    Convert.ToDouble(dr["Rate"]),
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

        internal static bool Save(short _FormId, short _ClientId, short _RateTypeId, List<___ClientRateDeliveryTonnage> details, string userId, DbTransaction transaction)
        {
            
            foreach (___ClientRateDeliveryTonnage iad in getIADetailChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientRates_ChargeOnDeliveryTonnage"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _FormId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.SmallInt, iad.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.SmallInt, iad.CDetailId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _ClientId);
                    db.AddInParameter(dbCommand, "RateType", SqlDbType.TinyInt, _RateTypeId);
                    db.AddInParameter(dbCommand, "Effectivedate", SqlDbType.DateTime, DateTime.ParseExact(iad.Effectivedate, "dd/MM/yyyy", CultureInfo.InvariantCulture));
                    db.AddInParameter(dbCommand, "VehicleTypeId", SqlDbType.SmallInt, iad.VehicleTypeId);
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, iad.RouteId);
                    db.AddInParameter(dbCommand, "Distance", SqlDbType.Float, iad.Distance);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, iad.Rate);
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
        private static IEnumerable<___ClientRateDeliveryTonnage> getIADetailChanges(List<___ClientRateDeliveryTonnage> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}
