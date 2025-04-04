using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRDedicatedRent
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        public DateTime? FromDate { get; set; }
        //public string Expirydate { get; set; }
        public short? VehicleId { get; set; }
        public short? VehicleGroupId { get; set; }
        public double Amount { get; set; } = 0;
        //public int ActualDays { get; set; }
        //public bool ProRate { get; set; } = false;
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        //public double Loadingcharges { get; set; }
        //public double Offloadingcharges { get; set; }
        #endregion

        #region constructor
        public WF_CRDedicatedRent()
        {

        }
        #endregion

        #region internal methods
        internal static List<WF_CRDedicatedRent> Get(short formId)
        {
            try
            {
                List<WF_CRDedicatedRent> rents = new List<WF_CRDedicatedRent>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRate_DedicatedRent"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                rents.Add(new WF_CRDedicatedRent
                                {
                                    CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                    DetailId = Convert.ToInt32(dr["DetailId"]),
                                    FromDate = Convert.ToDateTime(dr["FromDate"]),
                                    VehicleId = Convert.ToInt16(dr["VehicleId"]),
                                    VehicleGroupId = agHelper.sDBNull(dr["VehicleGroupId"]),
                                    Amount = Convert.ToDouble(dr["Amount"]),
                                    //ProRate = Convert.ToBoolean(dr["ProRate"]),
                                    Add = false,
                                    Action = dr["Action"].ToString()
                                });
                            }
                        }
                    }
                }
                return rents;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int _formId, List<WF_CRDedicatedRent> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRDedicatedRent crvr in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_ClientRate_DedicatedRent"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crvr.DetailId);
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _formId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crvr.CDetailId);
                    //db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, _rateTypeId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, crvr.FromDate);
                    db.AddInParameter(dbCommand, "VehicleId", SqlDbType.SmallInt, crvr.VehicleId);
                    db.AddInParameter(dbCommand, "VehicleGroupId", SqlDbType.SmallInt, crvr.VehicleGroupId);
                    //db.AddInParameter(dbCommand, "ProRate", SqlDbType.Bit, crvr.ProRate);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, crvr.Amount);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (crvr.Delete ? "D" : (crvr.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}