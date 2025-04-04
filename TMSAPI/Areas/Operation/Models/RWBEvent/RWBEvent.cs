using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;

namespace TMSAPI.Areas.Operation.Models
{
    //this file need massive revamping
    public class RWBEvent : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RwbId { get; set; }
        public string RwbNo { get; set; }
        public short? EventId { get; set; }
        //public short? FromCityId { get; set; }
        public short? ToCityId { get; set; }
        public short? VehicleId { get; set; }
        public short? TrailerId { get; set; }
        public DateTime? EventDate { get; set; }
        public DateTime? EventTime { get; set; }
        public short StateId { get; set; }
        public string StateName { get; set; }
        public decimal? CurrentKMs { get; set; }
        public short? DriverId1 { get; set; }
        public short? DriverId2 { get; set; }
        public short? SupplierId { get; set; }
        public bool Outsourced { private get; set; }
        public string RentedVehicleId { get; set; }      
        public string ReceiverName { get; set; }
        public string ReceiverCNIC { get; set; }
        public string InvoiceNo { get; set; }
        public string DeliveryNo { get; set; }
        public string ShpimentNo { private get; set; }
        public decimal? Tonnage { private get; set; }
        public short? DetGraceHRs { get; set; }
        public bool ApplyDet { get; set; }
        public short? ConsigneeId { get; set; }
        public List<RWBEvents> Details { get; set; } = new List<RWBEvents>();
        //Arrival Time//
        public DateTime? ArrivalDate { get; set; }
        public DateTime? ArrivalTime { get; set; }
        //Arrival Time//        
        public DateTime? NextDepartureDate { get; set; }
        public DateTime? NextDepartureTime { get; set; }
        ///Shortage//
        public decimal? ShortQty { get; set; } = 0;
        public decimal? ShortRate { get; set; } = 0;
        public string ShortageDesc { get; set; }
        ///Shortage//
        #endregion

        #region constructor
        public RWBEvent()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(RWBEvent re, short companyId, string userId)
        {
            try
            {
                if (re.EventId == 8 && re.ShortQty > 0)
                {
                    Shortage.Save(re.RwbId, re.ShortQty.Value, re.ShortRate.Value, re.ShortageDesc, userId);
                }

                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBEvent"))
                {
                    db.AddInParameter(dbCommand, "RwbNo", SqlDbType.VarChar, re.RwbNo);
                    db.AddInParameter(dbCommand, "EventId", SqlDbType.TinyInt, re.EventId);
                    db.AddInParameter(dbCommand, "ToCityId", SqlDbType.VarChar, re.ToCityId);
                    db.AddInParameter(dbCommand, "VehicleId", SqlDbType.SmallInt, re.VehicleId);
                    db.AddInParameter(dbCommand, "TrailerId", SqlDbType.SmallInt, re.TrailerId);
                    db.AddInParameter(dbCommand, "EventDate", SqlDbType.DateTime, re.EventDate);  
                    db.AddInParameter(dbCommand, "EventTime", SqlDbType.DateTime, re.EventTime); 
                    db.AddInParameter(dbCommand, "CurrentKMs", SqlDbType.Decimal, re.CurrentKMs);
                    db.AddInParameter(dbCommand, "DriverId1", SqlDbType.SmallInt, re.DriverId1);
                    db.AddInParameter(dbCommand, "DriverId2", SqlDbType.SmallInt, re.DriverId2);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, re.SupplierId);
                    db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.SmallInt, re.ConsigneeId);

                    if (re.EventId == 8) //delivery
                    {
                        db.AddInParameter(dbCommand, "ReceiverName", SqlDbType.VarChar, re.ReceiverName);
                        db.AddInParameter(dbCommand, "ReceiverCNIC", SqlDbType.VarChar, re.ReceiverCNIC);
                        db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, re.InvoiceNo);
                        db.AddInParameter(dbCommand, "OBDNo", SqlDbType.VarChar, re.DeliveryNo);
                        db.AddInParameter(dbCommand, "ShipmentNo", SqlDbType.VarChar, re.ShpimentNo);
                        db.AddInParameter(dbCommand, "Tonnage", SqlDbType.Decimal, re.Tonnage);
                        db.AddInParameter(dbCommand, "DetGraceHRs", SqlDbType.SmallInt, re.DetGraceHRs);
                        db.AddInParameter(dbCommand, "ApplyDet", SqlDbType.Bit, re.ApplyDet);
                        db.AddInParameter(dbCommand, "ArrivalDate", SqlDbType.DateTime, re.ArrivalDate);
                        db.AddInParameter(dbCommand, "ArrivalTime", SqlDbType.DateTime, re.ArrivalTime);
                        db.AddInParameter(dbCommand, "NextDepartureDate", SqlDbType.DateTime, re.NextDepartureDate);
                        db.AddInParameter(dbCommand, "NextDepartureTime", SqlDbType.DateTime, re.NextDepartureTime);
                    }
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "Outsourced", SqlDbType.Bit, re.Outsourced);

                    if (re.Outsourced)
                        db.AddInParameter(dbCommand, "RentedVehicleId", SqlDbType.VarChar, re.RentedVehicleId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception ex) { throw ex; }
        }

        internal static bool Cancel(string rwbNo, string  dtOnorAfter, string userId, short companyId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("CancelRWBEvents"))
                {
                    db.AddInParameter(dbCommand, "RWBNo", SqlDbType.VarChar, rwbNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "EventDateTime", SqlDbType.DateTime, DateTime.ParseExact(dtOnorAfter, "ddMMyyyyHH:mm", CultureInfo.CurrentCulture)); 
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}