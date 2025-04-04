using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;

namespace TMSAPI.Areas.Download.Models
{
    public class ExpenseSummary
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string RWBNo { get; set; }
        public string JobNo { get; set; }
        public string RWBDate { get; set; }
        public string DepartureDateTime { get; set; }
        public string DeliveryDateTime { get; set; }
        public string JobCompletionDate { get; set; }
        public string StatusName { get; set; }
        public string TripType { get; set; }
        public string CustomerOrderNo { get; set; }
        public string GatePassNo { get; set; }
        public string AssetNo { get; set; }
        public string CapacityName { get; set; }  
        public string ClientName { get; set; }        
        public string ShipperName { get; set; }
        public string ConsigneeName { get; set; }
        public string TripDuration { get; set; }
        public double JobStartKms { get; set; }
        public double JobEndKms { get; set; }
        public double JobEndKmsPerKM { get; set; }
        public double FuelAvgPerKm { get; set; }
        public double FuelLtrs { get; set; }
        public double FuelPerKm { get; set; }
        public double TollTax { get; set; }
        public double Food { get; set; }
        public double DriverIncentive { get; set; }
        public double UnReceipted { get; set; }
        public double CashFuel { get; set; }
        public double CrediFuel { get; set; }        
        public double OutSourcedVehicle { get; set; }
        public double Loading { get; set; }
        public double RepairAndMaintenance { get; set; }
        public double WeighBridgeCharges { get; set; }
        public double Miscellaneous { get; set; }
        public double DriverSpecialIncentive { get; set; }
        public double FuelCreditCash { get; set; }
        public double TotalTripExpenseByCash { get; set; }
        public double ExpenseAmount { get; set; }

        public string IsDisbursed { get; set; }
        

        #endregion

        #region constructor
        public ExpenseSummary()
        {
        }

        public ExpenseSummary(string _rwbNo, string _jobOrderNo, string _departureDateTime, string _deliveryDateTime, string _jobCompletionDate,
            string _statusname, string _TripType, string _CustomerOrderNo, string _GatePassNo,string _rwbDate, string _assetno, string _capacityName,
            string _clientName, string _ShipperName, string _consigneeName, string _tripDuration,
            double _JobStartKms, double _JobEndKms, double _JobEndKmsPerKM, double _FuelAvgPerKm, double _fuelLtrs, double _fuelperkm,
            double _tollTax, double _food, double _unReceipted, double _driverIncentive, double _outSourcedVehicle, double _loading, double _RepairAndMaintenance,
            double _WeighBridgeCharges, double _DriverSpecialIncentive, double _miscellaneous, double _CashFuel, double _CrediFuel,
            double _FuelCreditCash, double _TotalTripExpenseByCash, double _expenseAmount,  string _IsDisbursed)
        {
            RWBNo = _rwbNo;
            JobNo = _jobOrderNo;
            DepartureDateTime = _departureDateTime;
            DeliveryDateTime = _deliveryDateTime;
            JobCompletionDate = _jobCompletionDate;
            StatusName = _statusname;
            TripType = _TripType;            
            CustomerOrderNo = _CustomerOrderNo;
            GatePassNo = _GatePassNo;
            RWBDate = _rwbDate;
            AssetNo = _assetno;
            CapacityName = _capacityName;   
            ClientName = _clientName;
            ShipperName = _ShipperName;
            ConsigneeName = _consigneeName;
            TripDuration = _tripDuration;  
            JobStartKms = _JobStartKms;
            JobEndKms = _JobEndKms;
            JobEndKmsPerKM = _JobEndKmsPerKM;
            FuelAvgPerKm = _FuelAvgPerKm;
            FuelLtrs = _fuelLtrs;
            FuelPerKm = _fuelperkm;
            TollTax = _tollTax;
            Food = _food;
            UnReceipted = _unReceipted;
            DriverIncentive = _driverIncentive;
            OutSourcedVehicle = _outSourcedVehicle;
            Loading = _loading;
            RepairAndMaintenance = _RepairAndMaintenance;
            WeighBridgeCharges = _WeighBridgeCharges;
            DriverSpecialIncentive = _DriverSpecialIncentive;
            Miscellaneous = _miscellaneous;
            CashFuel = _CashFuel;
            CrediFuel = _CrediFuel;
            FuelCreditCash = _FuelCreditCash;
            TotalTripExpenseByCash = _TotalTripExpenseByCash;
            ExpenseAmount = _expenseAmount;
            IsDisbursed = _IsDisbursed;


        }
        #endregion

        #region internal methods
        internal static List<ExpenseSummary> Get(DateTime dateFrom, DateTime dateTo, short _dateBasisId, short companyid, string userId)
        {
            List<ExpenseSummary> lstPLD = new List<ExpenseSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extExpenseSummary"))
            {
                db.AddInParameter(dbCommand, "DateBasis", SqlDbType.TinyInt, _dateBasisId);
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                //db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, DateTime.ParseExact(_dateFrom, "ddMMyyyy", CultureInfo.InvariantCulture));
                //db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, DateTime.ParseExact(_dateTo, "ddMMyyyy", CultureInfo.InvariantCulture));
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyid);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataSet ds = db.ExecuteDataSet(dbCommand);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        lstPLD.Add(new ExpenseSummary(
                             dr["RwbNo"].ToString(),
                            dr["JobNo"].ToString(),
                            dr["DepartureDateTime"].ToString(),                           
                            dr["DeliveryDateTime"].ToString(),
                            dr["JobClosureDateTime"].ToString(),
                            dr["StateName"].ToString(),
                             dr["TripType"].ToString(),
                               dr["CustomerOrderNo"].ToString(),
                                 dr["GatePassNo"].ToString(),
                            dr["RWBDate"].ToString(),
                            dr["AssetNo"].ToString(),
                            dr["CapacityName"].ToString(),
                            dr["ClientName"].ToString(),
                            dr["ShipperName"].ToString(),
                            dr["ConsigneeName"].ToString(),
                            dr["ActualDuration"].ToString(),
                             Convert.ToDouble(dr["JobStartKms"]),
                            Convert.ToDouble(dr["JobEndKms"]),
                             Convert.ToDouble(dr["TotalJobRTDKms"]),
                              Convert.ToDouble(dr["FuelAvgPerKm"]),
                              Convert.ToDouble(dr["FuelLtrs"]),
                              Convert.ToDouble(dr["FuelCostPerKm"]),
                            Convert.ToDouble(dr["TollTax"]),
                            Convert.ToDouble(dr["Food"]),                                            
                            Convert.ToDouble(dr["UnReceipted"]), 
                            Convert.ToDouble(dr["DriverIncentive"]),
                            Convert.ToDouble(dr["OutSourcedVehicle"]),
                             Convert.ToDouble(dr["LoadingUnloadingCharges"]),
                             Convert.ToDouble(dr["RepairAndMaintenance"]),
                             Convert.ToDouble(dr["WeighBridgeCharges"]),
                             Convert.ToDouble(dr["DriverSpecialIncentive"]),
                            Convert.ToDouble(dr["Miscellaneous"]),
                            Convert.ToDouble(dr["CashFuel"]),
                             Convert.ToDouble(dr["CreditFuel"]),
                            Convert.ToDouble(dr["FuelCreditCash"]),
                             Convert.ToDouble(dr["TotalTripExpenseByCash"]),
                            Convert.ToDouble(dr["TotalTripExpense"]),  
                            dr["IsDisbursed"].ToString()));
                    }
                }
            }
            return lstPLD;
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