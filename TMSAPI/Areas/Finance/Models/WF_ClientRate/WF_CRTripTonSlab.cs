using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRTripTonSlab
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public short? CapacityId { get; set; }
        public short? RouteId { get; set; }
        public short? WayTypeId { get; set; } = 1;
        public double? WeightFrom { get; set; } = 0;
        public double? WeightTo { get; set; } = 0;
        public double Rate { get; set; } = 0;
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRTripTonSlab()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<WF_CRTripTonSlab> Get(short formid)
        {
            List<WF_CRTripTonSlab> slabs = new List<WF_CRTripTonSlab>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWFClientRate_TripTonSlab"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            slabs.Add(new WF_CRTripTonSlab
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                CapacityId = Convert.ToInt16(dr["CapacityId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                WayTypeId = Convert.ToInt16(dr["WayTypeId"]),
                                WeightFrom = Convert.ToDouble(dr["WeightFrom"]),
                                WeightTo = Convert.ToDouble(dr["WeightTo"]),
                                Rate = Convert.ToDouble(dr["Rate"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return slabs;
        }

        internal static bool Save(int formId, short rateTypeId, List<WF_CRTripTonSlab> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRTripTonSlab crts in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWFClientRate_TripTonSlab"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crts.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crts.CDetailId);
                    //db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, rateTypeId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crts.FromDate);
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crts.RouteId);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, crts.CapacityId);
                    db.AddInParameter(dbCommand, "WayTypeId", SqlDbType.SmallInt, crts.WayTypeId);
                    db.AddInParameter(dbCommand, "WeightFrom", SqlDbType.Float, crts.WeightFrom);
                    db.AddInParameter(dbCommand, "WeightTo", SqlDbType.Float, crts.WeightTo);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, crts.Rate);
                    //db.AddInParameter(dbCommand, "Detentionupto24hours", SqlDbType.Float, crts.Detentionupto24hours);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crts.Delete ? "D" : (crts.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
