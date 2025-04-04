using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ClientRate : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ClientId { get; set; }       
        public short? RateTypeId { get; set; }
        public string RateTypeName { get; set; }
        public short? InvoiceModeId { get; set; }
        public string InvoiceModeName { get; set; }
        public decimal? WaiverTon { get; set; }
        public decimal? MaxInvAmount { get; set; }
        public short? MaxShipmentsPerInvoice { get; set; }
        public short? DetGraceHrs { get; set; }
        public bool DetGraceHRsFromRwb { get; set; }
        public double LoadingChgs { get; set; }
        public double OffloadingChgs { get; set; }

        public bool InvoiceByRoute { get; set; }
        public bool InvoiceByOrigin { get; set; }
        public bool InvoiceByCategory { get; set; }
        public bool SeparateDetInv { get; set; }
        public bool SeparateOtherChgsInv { get; set; }

        public bool ValidateRoute { get; set; }
        public bool ValidateVehicle{ get; set; }
        //public bool ConsigneeMandatory { get; set; }
        public bool CategoryMandatory { get; set; }
        public bool ProductMandatory { get; set; }
        public bool InvMandatoryOnPoD { get; set; }
        public bool OBDMandatoryOnPoD { get; set; }
        public bool ShipmentNoMandatoryOnPoD { get; set; }
        public bool AllowZeroRate { get; set; }
        public bool InProcessForm { get; set; }

        public List<CRTrip> Trips { get; set; } = new List<CRTrip>();
        public List<CRTripTonSlab> TripTonSlabs { get; set; } = new List<CRTripTonSlab>();
        public List<CRDedicatedRent> DedicatedRents { get; set; } = new List<CRDedicatedRent>();
        public List<CRDedicatedVariable> DedicatedVariables { get; set; } = new List<CRDedicatedVariable>();
        public List<CRDedicatedKM> DedicatedKMs { get; set; } = new List<CRDedicatedKM>();
        public List<CRDedicatedTollTax> DedicatedTollTax { get; set; } = new List<CRDedicatedTollTax>();
        public List<CRFreightKLTon> FreightKLTons { get; set; } = new List<CRFreightKLTon>();
        public List<CRDetention> Detentions { get; set; } = new List<CRDetention>();
        public List<CRHandling> Handling { get; set; } = new List<CRHandling>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ClientRate()
        {

        }
        #endregion

        #region internal methods
        internal static ClientRate Get(short clientId, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientRateById"))
                {
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            using (ClientRate c = new ClientRate())
                            {
                                DataRow dr = ds.Tables[0].Rows[0];
                                c.ClientId = clientId;
                                c.RateTypeId = agHelper.sDBNull(dr["RateTypeId"]);
                                c.RateTypeName = dr["RateTypeName"].ToString();
                                c.DetGraceHrs = agHelper.sDBNull(dr["DetGraceHrs"]);
                                //c.LoadingChgs = agHelper.NVL(dr["LoadingChgs"], 0.00);//agHelper.dDBNull(dr["LoadingChgs"]);
                                //c.OffloadingChgs = agHelper.NVL(dr["OffloadingChgs"], 0.00);
                                c.InvoiceModeId = agHelper.sDBNull(dr["InvoiceModeId"]);
                                c.InvoiceModeName = dr["InvoiceModeName"].ToString();
                                c.MaxInvAmount = agHelper.dDBNull(dr["MaxInvAmount"]);
                                c.MaxShipmentsPerInvoice = agHelper.sDBNull(dr["MaxShipmentsPerInvoice"]);
                                c.WaiverTon = agHelper.dDBNull(dr["WaiverTon"]);
                                //c.DistanceByConsignee = Convert.ToBoolean(dr["DistanceByConsignee"]);
                                c.InProcessForm = dr["InProcessForm"] != DBNull.Value;
                                #region client flags
                                c.InvoiceByRoute = agHelper.NVL(dr["InvoiceByRoute"], false);
                                c.InvoiceByCategory = agHelper.NVL(dr["InvoiceByOrigin"], false);
                                c.InvoiceByCategory = agHelper.NVL(dr["InvoiceByCategory"], false);
                                c.CategoryMandatory = agHelper.NVL(dr["CategoryMandatory"], false);
                                c.ProductMandatory = agHelper.NVL(dr["ProductMandatory"], false);
                                c.InvMandatoryOnPoD = agHelper.NVL(dr["InvMandatoryOnPoD"], false);
                                c.OBDMandatoryOnPoD = agHelper.NVL(dr["OBDMandatoryOnPoD"], false);
                                c.ShipmentNoMandatoryOnPoD = agHelper.NVL(dr["ShipmentNoMandatoryOnPoD"], false);
                                c.ValidateRoute= agHelper.NVL(dr["ValidateRoute"], false);
                                c.ValidateVehicle= agHelper.NVL(dr["ValidateVehicle"], false);
                                //c.ConsigneeMandatory = agHelper.NVL(dr["ConsigneeMandatory"], false);
                                //c.DetentionByTime = agHelper.NVL(dr["DetentionByTime"], false);
                                c.AllowZeroRate = agHelper.NVL(dr["AllowZeroRate"], false);
                                c.DetGraceHRsFromRwb = agHelper.NVL(dr["DetGraceHRsFromRwb"], false);
                                c.SeparateDetInv = agHelper.NVL(dr["SeparateDetInv"], false);
                                c.SeparateOtherChgsInv = agHelper.NVL(dr["SeparateOtherChgsInv"], false);
                                #endregion
                                c.Footer = new agFooter(dr);
                                c.Handling = CRHandling.Get(clientId);
                                switch (c.RateTypeId)
                                {
                                    case 0:
                                        c.DedicatedRents = CRDedicatedRent.Get(clientId);
                                        c.DedicatedVariables = CRDedicatedVariable.Get(clientId);
                                        c.DedicatedKMs = CRDedicatedKM.Get(clientId);
                                        c.DedicatedTollTax = CRDedicatedTollTax.Get(clientId);
                                        break;
                                    case 1:
                                        c.Trips = CRTrip.Get(clientId);
                                        c.Detentions = CRDetention.Get(clientId);
                                        break;
                                    //case 2:
                                    //    c.FixedPerTripPlusPerKM = ___ClientRateFixedPerTripPlusPerKM.Get(clientId);
                                    //    break;
                                    case 3:
                                        c.TripTonSlabs = CRTripTonSlab.Get(clientId);
                                        c.Detentions = CRDetention.Get(clientId);
                                        break;
                                    //case 4:
                                    //    c.DeliveryTonnage = ClientRateDeliveryTonnage.Get(clientId);
                                    //    break;
                                    //case 5:
                                    //    c.TripLiter = ClientRateTripLiter.Get(clientId);
                                    //    break;
                                    case 6:
                                        c.FreightKLTons = CRFreightKLTon.Get(clientId);
                                        c.Detentions = CRDetention.Get(clientId);
                                        break;
                                }
                                return c;
                            }
                        }
                        else
                            return null;
                    }
                }
            }
            catch(Exception ex) { throw ex; }
        }

        //this function is kept just structurally whereas finance require no save action should be allowed to client Rate form
        //private static bool Save(ClientRate c, short companyId, string userId)
        //{
        //    DbConnection dbConnection = db.CreateConnection();
        //    dbConnection.Open();
        //    DbTransaction transaction = dbConnection.BeginTransaction();
        //    try
        //    {
        //        using (DbCommand dbCommandRateTypeId = db.GetStoredProcCommand("SaveClientRate"))
        //        {
        //            db.AddInParameter(dbCommandRateTypeId, "Clientid", SqlDbType.SmallInt, c.ClientId);
        //            db.AddInParameter(dbCommandRateTypeId, "RateTypeId", SqlDbType.TinyInt, c.RateTypeId);
        //            db.AddInParameter(dbCommandRateTypeId, "InvoiceModeId", SqlDbType.TinyInt, c.InvoiceModeId);
        //            db.AddInParameter(dbCommandRateTypeId, "WaiverTon", SqlDbType.Decimal, c.WaiverTon);
        //            db.AddInParameter(dbCommandRateTypeId, "MaxInvAmount", SqlDbType.Decimal, c.MaxInvAmount);
        //            db.AddInParameter(dbCommandRateTypeId, "MaxShipmentsPerInvoice", SqlDbType.SmallInt, c.MaxShipmentsPerInvoice);
        //            db.AddInParameter(dbCommandRateTypeId, "DetGraceHrs", SqlDbType.SmallInt, c.DetGraceHrs);
        //            db.AddInParameter(dbCommandRateTypeId, "DetGraceHRsFromRwb", SqlDbType.Bit, c.DetGraceHRsFromRwb);
        //            db.AddInParameter(dbCommandRateTypeId, "LoadingChgs", SqlDbType.Decimal, c.LoadingChgs);
        //            db.AddInParameter(dbCommandRateTypeId, "OffloadingChgs", SqlDbType.Decimal, c.OffloadingChgs);
                    
        //            //db.AddInParameter(dbCommandRateTypeId, "DistanceByConsignee", SqlDbType.Bit, c.DistanceByConsignee);
        //            db.AddInParameter(dbCommandRateTypeId, "InvoiceByRoute", SqlDbType.Bit, c.InvoiceByRoute);
        //            db.AddInParameter(dbCommandRateTypeId, "InvoiceByOrigin", SqlDbType.Bit, c.InvoiceByOrigin);
        //            db.AddInParameter(dbCommandRateTypeId, "InvoiceByCategory", SqlDbType.Bit, c.InvoiceByCategory);
        //            db.AddInParameter(dbCommandRateTypeId, "SeparateDetInv", SqlDbType.Bit, c.SeparateDetInv);
        //            db.AddInParameter(dbCommandRateTypeId, "SeparateOtherChgsInv", SqlDbType.Bit, c.SeparateOtherChgsInv);

        //            db.AddInParameter(dbCommandRateTypeId, "RouteMandatory", SqlDbType.Bit, c.RouteMandatory);
        //            db.AddInParameter(dbCommandRateTypeId, "VehicleMandatory", SqlDbType.Bit, c.VehicleMandatory);
        //            db.AddInParameter(dbCommandRateTypeId, "ConsigneeMandatory", SqlDbType.Bit, c.ConsigneeMandatory);
        //            db.AddInParameter(dbCommandRateTypeId, "CategoryMandatory", SqlDbType.Bit, c.CategoryMandatory);
        //            db.AddInParameter(dbCommandRateTypeId, "ProductMandatory", SqlDbType.Bit, c.ProductMandatory);
        //            db.AddInParameter(dbCommandRateTypeId, "InvMandatoryOnPoD", SqlDbType.Bit, c.InvMandatoryOnPoD);
        //            db.AddInParameter(dbCommandRateTypeId, "OBDMandatoryOnPoD", SqlDbType.Bit, c.OBDMandatoryOnPoD);
        //            db.AddInParameter(dbCommandRateTypeId, "ShipmentNoMandatoryOnPoD", SqlDbType.Bit, c.ShipmentNoMandatoryOnPoD);
        //            db.AddInParameter(dbCommandRateTypeId, "AllowZeroRate", SqlDbType.Bit, c.AllowZeroRate);
        //            db.AddInParameter(dbCommandRateTypeId, "CompanyId", SqlDbType.SmallInt, companyId);
        //            db.AddInParameter(dbCommandRateTypeId, "UserId", SqlDbType.VarChar, userId);
        //            db.AddInParameter(dbCommandRateTypeId, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
        //            //db.AddInParameter(dbCommandRateTypeId, "DetentionByTime", SqlDbType.Bit, c.DetentionByTime);
        //            //db.AddOutParameter(dbCommandRateTypeId, "newFormId", SqlDbType.Int, 32);
        //            db.ExecuteNonQuery(dbCommandRateTypeId, transaction);

        //            //c.FormId = Convert.ToInt16(dbCommandRateTypeId.Parameters["@newFormId"].Value);
        //            switch (c.RateTypeId)
        //            {
        //                case 0:
        //                    CRDedicatedRent.Save(c.ClientId.Value, c.RateTypeId.Value, c.DedicatedRents, userId, transaction);
        //                    CRDedicatedVariable.Save(c.ClientId.Value, c.RateTypeId.Value, c.DedicatedVariables, userId, transaction);
        //                    CRDedicatedKM.Save(c.ClientId.Value, c.DedicatedKMs, userId, transaction);
        //                    CRDedicatedTollTax.Save(c.ClientId.Value, c.DedicatedTollTax, userId, transaction);
        //                    break;
        //                case 1:
        //                    CRTrip.Save(c.ClientId.Value, c.RateTypeId.Value, c.Trips, userId, transaction);
        //                    CRDetention.Save(c.ClientId.Value, c.RateTypeId.Value, c.Detentions, userId, transaction);
        //                    break;
        //                //case 2:
        //                //    ___ClientRateFixedPerTripPlusPerKM.Save(c.FormId.Value, c.ClientId.Value,  c.RateTypeId.Value, c.FixedPerTripPlusPerKM, userId, transaction);
        //                //    break;
        //                case 3:
        //                    CRTripTonSlab.Save(c.ClientId.Value,  c.RateTypeId.Value, c.TripTonSlabs, userId, transaction);
        //                    break;
        //                //case 4:
        //                //    ClientRateDeliveryTonnage.Save(c.FormId.Value, c.ClientId.Value,  c.RateTypeId.Value, c.DeliveryTonnage, userId, transaction);
        //                //    break;
        //                //case 5:
        //                    //ClientRateTripLiter.Save(c.FormId.Value, c.ClientId.Value,  c.RateTypeId.Value, c.TripLiter, userId, transaction);
        //                  //  break;
        //                case 6:
        //                    CRFreightKLTon.Save(c.ClientId.Value, c.RateTypeId.Value, c.FreightKLTons, userId, transaction);
        //                    break;
        //            }
        //            transaction.Commit();
        //            return true;
        //        }
        //    }
        //    catch(Exception) {
        //        transaction.Rollback();
        //        throw;
        //    }
        //}
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}