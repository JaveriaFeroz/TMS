using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Download.Models
{
    public class TripExpenseSummary 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties        
        public string JobNo { get; set; }
        public string JobStartDate { get; set; }
        public string JobEndDate { get; set; }
        public string RWBNo { get; set; }
        public string RWBDate { get; set; }
        public double KMs { get; set; }
        public double FuelLtrs { get; set; }
        public string Departure { get; set; }
        public string BaseDepartureDateTime { get; set; }
        public string ArrivalDateTime { get; set; }
        public string DeliveryDateTime { get; set; }
        public string RouteName { get; set; }
        public string ClientName { get; set; }     
        public double TripRevenue { get; set; }     
        public double TollTax { get; set; }
        public double Food { get; set; }
        public double DriverIncentive { get; set; }
        public double Miscellaneous { get; set; }
        public double UnReceipted { get; set; }
        public double Fuel { get; set; }
        public double OutSourcedVehicle { get; set; }
        public double Penalty { get; set; }
        public double Loading { get; set; }
        public double Offloading { get; set; }
        public double OnRouteMaintainance { get; set; }
        public double HSSEIncentive { get; set; }
        public double OutsourceDetention { get; set; }
        public double TotalCost { get; set; }      
        public string InvoiceNo { get; set; }
        #endregion

        #region constructor
        public TripExpenseSummary()
        {
        }
        #endregion

        #region internal methods
        internal static List<TripExpenseSummary> Get(DateTime dateFrom, DateTime dateTo, short companyId, string userId)
        {
            List<TripExpenseSummary> expenses = new List<TripExpenseSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extTripExpense"))
            {
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataSet ds = db.ExecuteDataSet(dbCommand);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        expenses.Add(new TripExpenseSummary
                        {
                            JobNo = dr["JobNo"].ToString(),
                            JobStartDate = dr["JobStartDate"].ToString(),
                            JobEndDate = dr["JobClosureDateTime"].ToString(),
                            RWBNo = dr["RwbNo"].ToString(),
                            RWBDate = dr["RWBDate"].ToString(),
                            KMs = Convert.ToDouble(dr["TotalKMs"]),
                            FuelLtrs = Convert.ToDouble(dr["FuelLtrs"]),
                            Departure = dr["Departure"].ToString(),
                            BaseDepartureDateTime = dr["BaseDepartureDateTime"].ToString(),
                            ArrivalDateTime = dr["ArrivalDateTime"].ToString(),
                            DeliveryDateTime = dr["DeliveryDateTime"].ToString(),
                            RouteName = dr["RouteName"].ToString(),
                            ClientName = dr["ClientName"].ToString(),
                            TripRevenue = Convert.ToDouble(dr["TripRevenue"]),
                            TollTax = Convert.ToDouble(dr["TollTax"]),
                            Food = Convert.ToDouble(dr["Food"]),
                            DriverIncentive = Convert.ToDouble(dr["DriverIncentive"]),
                            Miscellaneous = Convert.ToDouble(dr["Miscellaneous"]),
                            UnReceipted = Convert.ToDouble(dr["UnReceipted"]),
                            Fuel = Convert.ToDouble(dr["Fuel"]),
                            OutSourcedVehicle = Convert.ToDouble(dr["OutSourcedVehicle"]),
                            Penalty = Convert.ToDouble(dr["Penalty"]),
                            Loading = Convert.ToDouble(dr["Loading"]),
                            Offloading = Convert.ToDouble(dr["Offloading"]),
                            OnRouteMaintainance = Convert.ToDouble(dr["OnRouteMaintainance"]),
                            HSSEIncentive = Convert.ToDouble(dr["HSSEIncentive"]),
                            OutsourceDetention = Convert.ToDouble(dr["OutsourceDetention"]),
                            TotalCost = Convert.ToDouble(dr["TotalCost"]),
                            InvoiceNo = dr["InvoiceNo"].ToString()
                        });
                    }
                }
            }
            return expenses;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}