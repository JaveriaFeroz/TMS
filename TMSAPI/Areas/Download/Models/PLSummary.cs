using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Models
{
    public class PLSummary 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string DepartureDateTime { get; set; }
        public string RWBNo { get; set; }
        public string JobNo { get; set; }
        public string TripType { get; set; }
        public string CustomerOrderNo { get; set; }
        public string GatePassNo { get; set; }
        public string RWBDate { get; set; }
        public string AssetNo { get; set; }
        public string ShipperName { get; set; }
        public string ConsigneeName { get; set; }
        public string CapacityName { get; set; }
        public string ProductName { get; set; }
        public string Load { get; set; }
        public string TripDuration { get; set; }
        public string ClientRef { get; set; }
        public string ClientNames { get; set; }
        public double JobStartKms { get; set; }
        public double JobEndKms { get; set; }
        public double JobEndKmsPerKM { get; set; }
        public double FuelPerKm { get; set; }
        public string LeaseTypeName { get; set; }
        public string ConsigneeRate { get; set; }
        public double TripRevenue { get; set; }
        public double NetRevenue { get; set; }
        public double FuelLtrs { get; set; }
        public double FuelCostPerKM { get; set; }
        public string RWBStateName { get; set; }
        public string JobStateName { get; set; }
        public double TollTax { get; set; }
        public double Food { get; set; }
        public double Fuel { get; set; }
        public double CreditFuel { get; set; }
        public double UnReceipted { get; set; }
        public double DriverIncentive { get; set; }
        public double OutSourcedVehicle { get; set; }
        public double OnRouteMaintainance { get; set; }
        public double Loading { get; set; }
        public double WeighBridgeCharges { get; set; }
        public double DriverSpecialIncentive { get; set; }
        public double TajTollTax { get; set; }
        public double TajFood { get; set; }
        public double TajUnReceiptedExpense { get; set; }
        public double TajDriverIncentive { get; set; }
        public double TajRepairMaintenance { get; set; }
        public double TajLoadingUnLoading { get; set; }
        public double TajDriverSpecialIncentive { get; set; }
        public double TajMisc { get; set; }
        public double FuelCreditCash { get; set; }
        public double TotalTripExpenseByCash { get; set; }
        public double ExpenseAmount { get; set; }
        public double KMperLitre { get; set; }
        public string DeliveryDateTime { get; set; }
        public string InvoiceNo { get; set; }
        public string JobCompletionDate { get; set; }

        public double? FuelCost { get; set; }
        public string RouteName { get; set; }        
        public double? TransitTime { get; set; }      
        public double? Distance { get; set; }   
        public double? OutsourceDetention { get; set; }
        public double? Penalty { get; set; }      
        //public double Offloading { get; set; }       
        public double? HSSEIncentive { get; set; }
        public double? Miscellaneous { get; set; }       
        //public double FixedCost { get; set; }
        public decimal? Weight { get; set; }       
        public double? TotalCost { get; set; }           
        public double? GensetFuelLtrs { get; set; }  
        public string BaseDepartureDateTime { get; set; }
        public string CityArrivalDateTime { get; set; }
        public string ArrivalDateTime { get; set; } 
        public decimal? DetentionHours { get; set; }
        public string Comments { get; set; }


        #endregion

        #region constructor
        public PLSummary()
        {
        }
        #endregion

        //these methods to be reviewed later for efficiency
        #region internal methods
        internal static List<PLSummary> GetRoutePL(DateTime dateFrom, DateTime dateTo, short jobPeriodId, 
            short dateBasisId, short companyId, string userId)
        {
            List<PLSummary> plsummary = new List<PLSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extProfitLoss"))
            {
                db.AddInParameter(dbCommand, "DateBasis", SqlDbType.TinyInt, dateBasisId);
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                db.AddInParameter(dbCommand, "JobPeriodId", SqlDbType.SmallInt, jobPeriodId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataSet ds = db.ExecuteDataSet(dbCommand);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        plsummary.Add(new PLSummary
                        {
                            JobNo = dr["JobNo"].ToString(),
                            RWBNo = dr["RwbNo"].ToString(),
                            RWBDate = dr["RWBDate"].ToString(),
                            RouteName = dr["RouteName"].ToString(),
                            CapacityName = dr["CapacityName"].ToString(),
                            AssetNo = dr["AssetNo"].ToString(),
                            LeaseTypeName = dr["LeaseTypeName"].ToString(),
                            ClientRef = dr["ClientRef"].ToString(),
                            ClientNames = dr["ClientName"].ToString(),
                            RWBStateName = dr["RWBStateName"].ToString(),
                            TripDuration = dr["TripDuration"].ToString(),
                            TripRevenue = Convert.ToDouble(dr["TripRevenue"]),
                            FuelCostPerKM = Convert.ToDouble(dr["FuelCostPerKM"]),
                            Distance = Convert.ToDouble(dr["Distance"]),
                            FuelCost = Convert.ToDouble(dr["FuelCost"]),
                            TollTax = Convert.ToDouble(dr["TollTax"]),
                            Food = Convert.ToDouble(dr["Food"]),
                            DriverIncentive = Convert.ToDouble(dr["DriverIncentive"]),
                            Miscellaneous = Convert.ToDouble(dr["Miscellaneous"]),
                            UnReceipted = Convert.ToDouble(dr["UnReceipted"]),
                            Fuel = Convert.ToDouble(dr["Fuel"]),
                            OutSourcedVehicle = Convert.ToDouble(dr["OutSourcedVehicle"]),
                            Penalty = Convert.ToDouble(dr["Penalty"]),
                            Loading = Convert.ToDouble(dr["Loading"]),
                            //Offloading = Convert.ToDouble(dr["Offloading"]),
                            OnRouteMaintainance = Convert.ToDouble(dr["OnRouteMaintainance"]),
                            HSSEIncentive = Convert.ToDouble(dr["HSSEIncentive"]),
                            OutsourceDetention = Convert.ToDouble(dr["OutsourceDetention"]),
                            ExpenseAmount = Convert.ToDouble(dr["ExpenseAmount"]),
                            //FixedCost = Convert.ToDouble(dr["FixedCost"]),
                            GensetFuelLtrs = Convert.ToDouble(dr["GensetFuelLtrs"]),
                            Weight = agHelper.dDBNull(dr["Weight"]),
                            TotalCost = Convert.ToDouble(dr["TotalCost"]),
                            NetRevenue = Convert.ToDouble(dr["NetRevenue"]),
                            KMperLitre = Convert.ToDouble(dr["KMPerLitre"]),
                            FuelPerKm = Convert.ToDouble(dr["FuelPerKM"]),
                            FuelLtrs = Convert.ToDouble(dr["FuelLtrs"]),
                            DepartureDateTime = dr["DepartureDateTime"].ToString(),
                            BaseDepartureDateTime = dr["BaseDepartureDateTime"].ToString(),
                            CityArrivalDateTime = dr["CityArrivalDateTime"].ToString(),
                            ArrivalDateTime = dr["ArrivalAtClient"].ToString(),
                            DeliveryDateTime = dr["DeliveryDateTime"].ToString(),
                            DetentionHours = agHelper.dDBNull(dr["DetHrs"]),
                            JobCompletionDate = dr["JobClosureDateTime"].ToString(),
                            //Comments = dr["Comments"].ToString(),
                            TransitTime = Convert.ToDouble(dr["TransitTime"]),
                            InvoiceNo = dr["InvoiceNo"].ToString()
                        });
                    }
                }
            }
            return plsummary;
        }

        //tristar version
        internal static List<PLSummary> GetConsigneePL(DateTime dateFrom, DateTime dateTo, short jobPeriodId,
            short dateBasisId, short companyId, string userId)
        {
            List<PLSummary> plsummary = new List<PLSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extProfitLoss"))
            {
                db.AddInParameter(dbCommand, "DateBasis", SqlDbType.TinyInt, dateBasisId);
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                db.AddInParameter(dbCommand, "JobPeriodId", SqlDbType.VarChar, jobPeriodId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataSet ds = db.ExecuteDataSet(dbCommand);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        plsummary.Add(new PLSummary
                        {
                            JobNo = dr["JobNo"].ToString(),
                            RWBNo = dr["RwbNo"].ToString(),
                            RWBDate = dr["RWBDate"].ToString(),
                            CapacityName = dr["CapacityName"].ToString(),
                            AssetNo = dr["AssetNo"].ToString(),
                            LeaseTypeName = dr["LeaseTypeName"].ToString(),
                            ClientRef = dr["ClientRef"].ToString(),
                            ClientNames = dr["ClientName"].ToString(),
                            RWBStateName = dr["RWBStateName"].ToString(),
                            TripDuration = dr["TripDuration"].ToString(),
                            TripRevenue = Convert.ToDouble(dr["TripRevenue"]),
                            FuelCostPerKM = Convert.ToDouble(dr["FuelCostPerKM"]),
                            TollTax = Convert.ToDouble(dr["TollTax"]),
                            Food = Convert.ToDouble(dr["Food"]),
                            DriverIncentive = Convert.ToDouble(dr["DriverIncentive"]),
                            Miscellaneous = Convert.ToDouble(dr["Miscellaneous"]),
                            UnReceipted = Convert.ToDouble(dr["UnReceipted"]),
                            Fuel=Convert.ToDouble(dr["CashFuel"]),
                            CreditFuel = Convert.ToDouble(dr["CreditFuel"]),
                            OutSourcedVehicle = Convert.ToDouble(dr["OutSourcedVehicle"]),
                            DriverSpecialIncentive = Convert.ToDouble(dr["DriverSpecialIncentive"]),
                            Loading = Convert.ToDouble(dr["LoadingUnloadingCharges"]),
                            WeighBridgeCharges = Convert.ToDouble(dr["WeighBridgeCharges"]),
                            OnRouteMaintainance = Convert.ToDouble(dr["RepairAndMaintenance"]),
                            //TajRepairMaintenance=         Convert.ToDouble(dr["RepairAndMaintenance"]),
                            TajTollTax = Convert.ToDouble(dr["TajTollTax"]),
                            TajFood = Convert.ToDouble(dr["TajDriverFood"]),
                            TajDriverIncentive = Convert.ToDouble(dr["TajDriverIncentive"]),
                            TajDriverSpecialIncentive = Convert.ToDouble(dr["TajDriverSpecialIncentive"]),
                            TajUnReceiptedExpense = Convert.ToDouble(dr["TajUnReceiptedExpense"]),
                            TajRepairMaintenance = Convert.ToDouble(dr["TajRepairMaintenance"]),
                            TajLoadingUnLoading = Convert.ToDouble(dr["TajLoadingUnLoading"]),
                            TajMisc = Convert.ToDouble(dr["TajMisc"]),
                            FuelCreditCash = Convert.ToDouble(dr["FuelCreditCash"]),
                            TotalTripExpenseByCash = Convert.ToDouble(dr["TripExpenseByCash"]),
                            ExpenseAmount = Convert.ToDouble(dr["ExpenseAmount"]),
                            NetRevenue = Convert.ToDouble(dr["NetRevenue"]),
                            KMperLitre = Convert.ToDouble(dr["KMPerLitre"]),
                            FuelPerKm = Convert.ToDouble(dr["FuelPerKM"]),
                            FuelLtrs = Convert.ToDouble(dr["FuelLitre"]),
                            DepartureDateTime = dr["DepartureDate"].ToString(),
                            DeliveryDateTime = dr["DeliveryDate"].ToString(),
                            JobCompletionDate = dr["JobCompletionDate"].ToString(),
                            InvoiceNo = dr["InvoiceNo"].ToString(),
                            CustomerOrderNo = dr["CustomerOrderNo"].ToString(),
                            GatePassNo = dr["GatePassNo"].ToString(),
                            ShipperName = dr["ShipperName"].ToString(),
                            ConsigneeName = dr["ConsigneeName"].ToString(),
                            ProductName = dr["ProductName"].ToString(),
                            Load = dr["Load"].ToString(),
                            JobStartKms = Convert.ToDouble(dr["RwbStartKms"]),
                            JobEndKms = Convert.ToDouble(dr["RwbEndKMs"]),
                            JobEndKmsPerKM = Convert.ToDouble(dr["TotalJobRTDKms"]),
                            ConsigneeRate = dr["ConsigneeRate"].ToString(),
                            TripType = dr["TripType"].ToString(),
                            JobStateName = dr["JobStateName"].ToString()
                        });
                    }
                }
            }
            return plsummary;
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