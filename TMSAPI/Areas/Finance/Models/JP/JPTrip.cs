using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Finance.Models
{
    public class JPTrip
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        //public short? ClientId { get; set; }
        //public string ClientName { get; set; }
        //public DateTime? JobCloseDateFrom { get; set; }
        //public DateTime? JobCloseDateTo { get; set; }
        //public int? JobId { get; set; }
        public int? RwbId { get; set; }
        public string RwbNo { get; set; }
        public string JobNo { get; set; }
        public string ClientRefNo { get; set; }
        public string PackSlipNo { get; set; }
        public string VehicleNo { get; set; }
        public string DepartureDate { get; set; }
        public string JobCloseDate { get; set; }
        public double Amount { get; set; }
        public bool Selected { get; set; }
        #endregion

        #region constructor
        public JPTrip()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<JPTrip> Get(int voucherId)
        {
            List<JPTrip> trips = new List<JPTrip>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJPTripsById"))
            {
                db.AddInParameter(dbCommand, "VoucherId", SqlDbType.VarChar, voucherId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            trips.Add(new JPTrip
                            {
                                //JobCloseDateFrom = Convert.ToDateTime(dr["JobCloseDateFrom"]),
                                //JobCloseDateTo = Convert.ToDateTime(dr["JobCloseDateTo"]),
                                //ClientId = Convert.ToInt16(dr["ClientId"]),
                                //ClientName = dr["ClientName"].ToString(),
                                //JobId = Convert.ToInt16(dr["JobId"]),
                                RwbId = Convert.ToInt32(dr["RwbId"]),
                                RwbNo = dr["RwbNo"].ToString(),
                                JobNo = dr["JobNo"].ToString(),
                                ClientRefNo = dr["CustomerOrderNo"].ToString(),
                                PackSlipNo = dr["GatePassNo"].ToString(),
                                VehicleNo = dr["AssetNo"].ToString(),
                                DepartureDate = dr["DepartureDate"].ToString(),
                                JobCloseDate = dr["JobClosureDate"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Selected = Convert.ToBoolean(dr["Selected"])
                            });
                        }
                    }
                }
            }
            return trips;
        }

        internal static List<JPTrip> GetOSTrips(short? clientId, DateTime jobCloseDateFrom, DateTime jobCloseDateTo, short CompanyId )
        {
            try
            {
                List<JPTrip> trips = new List<JPTrip>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetOutstandingTrips"))
                {
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                    db.AddInParameter(dbCommand, "JobCloseDateFrom", SqlDbType.DateTime, jobCloseDateFrom);
                    db.AddInParameter(dbCommand, "JobCloseDateTo", SqlDbType.DateTime, jobCloseDateTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, CompanyId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                trips.Add(new JPTrip
                                {
                                    //JobCloseDateFrom = Convert.ToDateTime(dr["JobCloseDateFrom"]),
                                    //JobCloseDateTo = Convert.ToDateTime(dr["JobCloseDateTo"]),
                                    //ClientId = Convert.ToInt16(dr["ClientId"]),
                                    //ClientName = dr["ClientName"].ToString(),
                                    //JobId = Convert.ToInt16(dr["JobId"]),
                                    JobNo = dr["JobNo"].ToString(),
                                    RwbId = Convert.ToInt32(dr["RwbId"]),
                                    RwbNo = dr["RwbNo"].ToString(),
                                    ClientRefNo = dr["CustomerOrderNo"].ToString(),
                                    PackSlipNo = dr["GatePassNo"].ToString(),
                                    VehicleNo = dr["AssetNo"].ToString(),
                                    DepartureDate = dr["DepartureDate"].ToString(),
                                    JobCloseDate = dr["JobClosureDate"].ToString(),
                                    Amount = Convert.ToDouble(dr["TotalExpense"]),
                                    Selected = Convert.ToBoolean(dr["Selected"])
                                });
                            }
                        }
                    }
                }
                return trips;
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(int voucherId, List<JPTrip> details, string userId, DbTransaction transaction)
        {
            foreach (JPTrip jpt in details.Where(x => x.Selected))
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveJPTrip"))
                {
                    db.AddInParameter(dbCommandDetail, "VoucherId", SqlDbType.Int, voucherId);
                    //db.AddInParameter(dbCommandDetail, "ClientId", SqlDbType.SmallInt, jpt.ClientId);
                    db.AddInParameter(dbCommandDetail, "RwbId", SqlDbType.SmallInt, jpt.RwbId);
                    db.AddInParameter(dbCommandDetail, "Amount", SqlDbType.Decimal, jpt.Amount);
                    //db.AddInParameter(dbCommandDetail, "JobCloseDateFrom", SqlDbType.DateTime, DateTime.ParseExact(jpt.JobCloseDateFrom, "dd/MM/yyyy", CultureInfo.InvariantCulture));  
                    //db.AddInParameter(dbCommandDetail, "JobCloseDateTo", SqlDbType.DateTime, DateTime.ParseExact(jpt.JobCloseDateTo, "dd/MM/yyyy", CultureInfo.InvariantCulture));
                    //db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommandDetail, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
