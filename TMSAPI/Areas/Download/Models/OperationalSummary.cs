using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Download.Models
{
    //to be worked upon later
    public class OperationalSummary
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties        
        public string JobNo { get; set; }    
        public string RwbNo { get; set; }
        public string RWBDate { get; set; }
        public string ConsigneeName { get; set; }
        public string ShipperRefNo { get; set; }
        public string ShipperRefNo2 { get; set; }
        public string ShipmentNo { get; set; }
        public string CategoryName { get; set; }
        public string LinkedRwbNo { get; set; }
        public string InvoiceNo { get; set; }
        public string AssetNo { get; set; }
        public string TrailerNo { get; set; }
        public string RouteName { get; set; }
        public string CapacityName { get; set; }
        public string LeaseTypeName { get; set; }
        public string ClientName { get; set; }
        public string Driver1Name { get; set; }
        public string Driver2Name { get; set; }
        public double Weight { get; set; }
        public string ClientInvoiceNo { get; set; }
        public string DeliveryNo { get; set; }
        public double KMs { get; set; }
        public double StandardKMs { get; set; }
        public double KMperLitre { get; set; }
        public double FuelPerKM { get; set; }
        public string DepartureDateTime { get; set; }
        public string BaseDepartureDateTime { get; set; }
        public string DestArrivalDateTime { get; set; }
        public string ArrivalDateTime { get; set; }
        public string DeliveryDateTime { get; set; }
        public string RwbStatusName { get; set; }       
        public double TotalExpense { get; set; }     
        public double TollTax { get; set; }
        public double Food { get; set; }
        public double DriverIncentive { get; set; }
        public double UnReceipted { get; set; }
        public double Fuel { get; set; }
        public double Penalty { get; set; }
        public double Loading { get; set; }
        public double Offloading { get; set; }
        public double OutSourcedVehicle { get; set; }
        public double OnRouteMaintainance { get; set; }
        public double OutsourceDetention { get; set; }
        public double HSSEIncentive { get; set; }
        public double Miscellaneous { get; set; }
        #endregion

        #region constructor
        public OperationalSummary()
        {
        }
        #endregion

        #region internal methods
        internal static List<OperationalSummary> Get(DateTime dateFrom, DateTime dateTo, short companyId, string userId)
        {
            List<OperationalSummary> ops = new List<OperationalSummary>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("extOperationData"))
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
                        ops.Add(new OperationalSummary
                        {
                            JobNo = dr["JobNo"].ToString(),
                            RwbNo = dr["RwbNo"].ToString(),
                            RWBDate = dr["RWBDate"].ToString(),
                            ConsigneeName = dr["ConsigneeName"].ToString(),
                            ShipperRefNo = dr["CustomerOrderNo"].ToString(),
                            CategoryName = dr["CategoryName"].ToString(),
                            AssetNo = dr["AssetNo"].ToString(),
                            TrailerNo = dr["TrailerNo"].ToString(),
                            CapacityName = dr["CapacityName"].ToString(),
                            LeaseTypeName = dr["LeaseTypeName"].ToString(),
                            RouteName = dr["RouteName"].ToString(),
                            ShipperRefNo2 = dr["ClientRefNo"].ToString(),
                            ClientName = dr["ClientName"].ToString(),
                            Driver1Name = dr["Driver1"].ToString(),
                            Driver2Name = dr["Driver2"].ToString(),
                            Weight = Convert.ToDouble(dr["Tonnage"]),
                            ClientInvoiceNo = dr["ClientInvoiceNo"].ToString(),
                            ShipmentNo = dr["ShipmentNo"].ToString(),
                            DeliveryNo = dr["OBDNo"].ToString(),
                            KMs = Convert.ToDouble(dr["TotalKms"]),
                            StandardKMs = Convert.ToDouble(dr["StdKMs"]),
                            KMperLitre = Convert.ToDouble(dr["KMPerLitre"]),
                            FuelPerKM = Convert.ToDouble(dr["FuelPerKM"]),
                            DepartureDateTime = dr["Departure"].ToString(),
                            BaseDepartureDateTime = dr["DepartureFromBaseDateTime"].ToString(),
                            DestArrivalDateTime = dr["ArrivalAtDestinationCity"].ToString(),
                            ArrivalDateTime = dr["ArrivalAtClientPremises"].ToString(),
                            DeliveryDateTime = dr["Delivery"].ToString(),
                            RwbStatusName = dr["RwbStatus"].ToString(),
                            TotalExpense = Convert.ToDouble(dr["TotalExpense"]),
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
                            OutsourceDetention = Convert.ToDouble(dr["OutsourceDetention"])
                        });
                    }
                }
            }
            return ops;
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