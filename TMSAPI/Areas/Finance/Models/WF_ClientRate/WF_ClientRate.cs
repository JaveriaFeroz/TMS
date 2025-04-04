using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_ClientRate : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? FormId { get; set; }
        public short? ClientId { get; set; }       
        public short? RateTypeId { get; set; }
        public short? InvoiceModeId { get; set; }
        public decimal? WaiverTon { get; set; }
        public decimal? MaxInvAmount { get; set; }
        public short? MaxShipmentsPerInvoice { get; set; }
        public short? DetGraceHrs { get; set; }
        public bool? DetGraceHRsFromRWB { get; set; } = false;
        //public double LoadingChgs { get; set; }
        //public double OffloadingChgs { get; set; }
        //public bool DistanceByConsignee { get; set; }

        public bool? InvoiceByRoute { get; set; } = false;
        public bool? InvoiceByOrigin { get; set; } = false;
        public bool? InvoiceByCategory { get; set; } = false;
        public bool? SeparateDetInv { get; set; } = false;
        public bool? SeparateOtherChgsInv { get; set; } = false;

        public bool? ValidateRoute { get; set; } = false;
        public bool? ValidateVehicle { get; set; } = false;
        //public bool ConsigneeMandatory { get; set; }
        public bool? CategoryMandatory { get; set; } = false;
        public bool? ProductMandatory { get; set; } = false;
        public bool? InvMandatoryOnPoD { get; set; } = false;
        public bool? OBDMandatoryOnPoD { get; set; } = false;
        public bool? ShipmentNoMandatoryOnPoD { get; set; } = false;
        public bool? AllowZeroRate { get; set; } = false;

        public List<WF_CRTrip> Trips { get; set; } = new List<WF_CRTrip>();
        public List<WF_CRTripTonSlab> TripTonSlabs { get; set; } = new List<WF_CRTripTonSlab>();
        public List<WF_CRDedicatedRent> DedicatedRents { get; set; } = new List<WF_CRDedicatedRent>();
        public List<WF_CRDedicatedVariable> DedicatedVariables { get; set; } = new List<WF_CRDedicatedVariable>();
        public List<WF_CRDedicatedKM> DedicatedKMs { get; set; } = new List<WF_CRDedicatedKM>();
        public List<WF_CRDedicatedTollTax> DedicatedTollTax { get; set; } = new List<WF_CRDedicatedTollTax>();
        public List<WF_CRHandling> Handling { get; set; } = new List<WF_CRHandling>();
        public List<WF_CRFreightKLTon> FreightKLTons { get; set; } = new List<WF_CRFreightKLTon>();
        public List<WF_CRDetention> Detentions { get; set; } = new List<WF_CRDetention>();

        public short? StateId { get; set; }
        public string StateName { get; set; }
        public string Owner { get; set; }
        public bool Approved { get; set; } = false;
        public bool Rejected { get; set; } = false;
        public bool Completed { get; set; } = false;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public WF_ClientRate()
        {

        }
        #endregion

        #region internal methods
        internal static WF_ClientRate Get(short formId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRateById"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        using (WF_ClientRate c = new WF_ClientRate())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            c.FormId = formId;
                            c.ClientId = Convert.ToInt16(dr["ClientId"]);
                            c.RateTypeId = Convert.ToInt16(dr["RateTypeId"]);
                            c.DetGraceHrs = Convert.ToInt16(dr["DetGraceHrs"]);
                            c.DetGraceHRsFromRWB = Convert.ToBoolean(dr["DetGraceHRsFromRWB"]);
                            //c.LoadingChgs = Convert.ToDouble(dr["LoadingChgs"]);
                            //c.OffloadingChgs = Convert.ToDouble(dr["OffloadingChgs"]);
                            c.InvoiceModeId = Convert.ToInt16(dr["InvoiceModeId"]);
                            c.MaxInvAmount = Convert.ToDecimal(dr["MaxInvAmount"]);
                            c.MaxShipmentsPerInvoice = Convert.ToInt16(dr["MaxShipmentsPerInvoice"]);
                            c.WaiverTon = Convert.ToDecimal(dr["WaiverTon"]);
                            //c.DistanceByConsignee = Convert.ToBoolean(dr["DistanceByConsignee"]);
                            c.StateId = Convert.ToInt16(dr["StateId"]);
                            c.StateName = dr["StateName"].ToString();
                            c.Owner = dr["Owner"].ToString();
                            c.Completed = Convert.ToBoolean(dr["Completed"]);
                            #region client flags
                            c.InvoiceByRoute = Convert.ToBoolean(dr["InvoiceByRoute"]);
                            c.InvoiceByCategory = Convert.ToBoolean(dr["InvoiceByCategory"]);
                            c.InvoiceByOrigin = Convert.ToBoolean(dr["InvoiceByOrigin"]);
                            c.CategoryMandatory = Convert.ToBoolean(dr["CategoryMandatory"]);
                            c.ProductMandatory = Convert.ToBoolean(dr["ProductMandatory"]);
                            c.InvMandatoryOnPoD = Convert.ToBoolean(dr["InvMandatoryOnPoD"]);
                            c.OBDMandatoryOnPoD = Convert.ToBoolean(dr["OBDMandatoryOnPoD"]);
                            c.ShipmentNoMandatoryOnPoD = Convert.ToBoolean(dr["ShipmentNoMandatoryOnPoD"]);
                            c.ValidateRoute = Convert.ToBoolean(dr["ValidateRoute"]);
                            c.ValidateVehicle = Convert.ToBoolean(dr["ValidateVehicle"]);
                            //c.ConsigneeMandatory = Convert.ToBoolean(dr["ConsigneeMandatory"]);
                            //c.DetentionByTime = Convert.ToBoolean(dr["DetentionByTime"]);
                            c.AllowZeroRate = Convert.ToBoolean(dr["AllowZeroRate"]);
                            c.SeparateDetInv = Convert.ToBoolean(dr["SeparateDetInv"]);
                            c.SeparateOtherChgsInv = Convert.ToBoolean(dr["SeparateOtherChgsInv"]);
                            #endregion
                            c.Footer = new agFooter(dr);
                            switch (c.RateTypeId)
                            {
                                case 0:
                                    c.DedicatedRents = WF_CRDedicatedRent.Get(formId);
                                    c.DedicatedVariables = WF_CRDedicatedVariable.Get(formId);
                                    c.DedicatedKMs = WF_CRDedicatedKM.Get(formId);
                                    c.DedicatedTollTax = WF_CRDedicatedTollTax.Get(formId);
                                    break;
                                case 1:
                                    c.Trips = WF_CRTrip.Get(formId);
                                    c.Detentions = WF_CRDetention.Get(formId);
                                    break;
                                case 3:
                                    c.TripTonSlabs = WF_CRTripTonSlab.Get(formId);
                                    c.Detentions = WF_CRDetention.Get(formId);
                                    break;
                                case 6:
                                    c.FreightKLTons = WF_CRFreightKLTon.Get(formId);
                                    c.Detentions = WF_CRDetention.Get(formId);
                                    break;
                            }
                            c.Handling = WF_CRHandling.Get(formId);
                            return c;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WF_ClientRate c, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommandRateTypeId = db.GetStoredProcCommand("SaveWF_ClientRate"))
                {
                    db.AddInParameter(dbCommandRateTypeId, "FormId", SqlDbType.SmallInt, c.FormId);
                    db.AddInParameter(dbCommandRateTypeId, "Clientid", SqlDbType.SmallInt, c.ClientId);
                    db.AddInParameter(dbCommandRateTypeId, "RateTypeId", SqlDbType.TinyInt, c.RateTypeId);
                    db.AddInParameter(dbCommandRateTypeId, "DetGraceHRs", SqlDbType.SmallInt, c.DetGraceHrs);
                    db.AddInParameter(dbCommandRateTypeId, "DetGraceHRsFromRWB", SqlDbType.Bit, c.DetGraceHRsFromRWB);
                    //db.AddInParameter(dbCommandRateTypeId, "LoadingChgs", SqlDbType.Decimal, c.LoadingChgs);
                    //db.AddInParameter(dbCommandRateTypeId, "OffloadingChgs", SqlDbType.Decimal, c.OffloadingChgs);
                    db.AddInParameter(dbCommandRateTypeId, "InvoiceModeId", SqlDbType.TinyInt, c.InvoiceModeId);
                    db.AddInParameter(dbCommandRateTypeId, "MaxInvAmount", SqlDbType.Decimal, c.MaxInvAmount);
                    db.AddInParameter(dbCommandRateTypeId, "MaxShipmentsPerInvoice", SqlDbType.SmallInt, c.MaxShipmentsPerInvoice);
                    db.AddInParameter(dbCommandRateTypeId, "WaiverTon", SqlDbType.Decimal, c.WaiverTon);
                    //db.AddInParameter(dbCommandRateTypeId, "DistanceByConsignee", SqlDbType.Bit, c.DistanceByConsignee);
                    db.AddInParameter(dbCommandRateTypeId, "InvoiceByRoute", SqlDbType.Bit, c.InvoiceByRoute);
                    db.AddInParameter(dbCommandRateTypeId, "InvoiceByCategory", SqlDbType.Bit, c.InvoiceByCategory);
                    db.AddInParameter(dbCommandRateTypeId, "InvoiceByOrigin", SqlDbType.Bit, c.InvoiceByOrigin);

                    db.AddInParameter(dbCommandRateTypeId, "CategoryMandatory", SqlDbType.Bit, c.CategoryMandatory);
                    db.AddInParameter(dbCommandRateTypeId, "ProductMandatory", SqlDbType.Bit, c.ProductMandatory);
                    db.AddInParameter(dbCommandRateTypeId, "InvMandatoryOnPoD", SqlDbType.Bit, c.InvMandatoryOnPoD);
                    db.AddInParameter(dbCommandRateTypeId, "OBDMandatoryOnPoD", SqlDbType.Bit, c.OBDMandatoryOnPoD);
                    db.AddInParameter(dbCommandRateTypeId, "ShipmentNoMandatoryOnPoD", SqlDbType.Bit, c.ShipmentNoMandatoryOnPoD);

                    db.AddInParameter(dbCommandRateTypeId, "SeparateDetInv", SqlDbType.Bit, c.SeparateDetInv);
                    db.AddInParameter(dbCommandRateTypeId, "SeparateOtherChgsInv", SqlDbType.Bit, c.SeparateOtherChgsInv);

                    db.AddInParameter(dbCommandRateTypeId, "ValidateRoute", SqlDbType.Bit, c.ValidateRoute);
                    db.AddInParameter(dbCommandRateTypeId, "ValidateVehicle", SqlDbType.Bit, c.ValidateVehicle);
                    //db.AddInParameter(dbCommandRateTypeId, "ConsigneeMandatory", SqlDbType.Bit, c.ConsigneeMandatory);
                    db.AddInParameter(dbCommandRateTypeId, "AllowZeroRate", SqlDbType.Bit, c.AllowZeroRate);
                    //db.AddInParameter(dbCommandRateTypeId, "InvoiceByRoute", SqlDbType.Bit, c.InvoiceByRoute);
                    db.AddInParameter(dbCommandRateTypeId, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommandRateTypeId, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommandRateTypeId, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommandRateTypeId, "newFormId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommandRateTypeId, transaction);

                    c.FormId = Convert.ToInt16(dbCommandRateTypeId.Parameters["@newFormId"].Value);
                    switch (c.RateTypeId)
                    {
                        case 0:
                            WF_CRDedicatedRent.Save(c.FormId.Value, c.DedicatedRents, userId, transaction);
                            WF_CRDedicatedVariable.Save(c.FormId.Value, c.RateTypeId.Value, c.DedicatedVariables, userId, transaction);
                            WF_CRDedicatedKM.Save(c.FormId.Value, c.DedicatedKMs, userId, transaction);
                            WF_CRDedicatedTollTax.Save(c.FormId.Value, c.DedicatedTollTax, userId, transaction);
                            break;
                        case 1:
                            WF_CRTrip.Save(c.FormId.Value, c.RateTypeId.Value, c.Trips, userId, transaction);
                            WF_CRDetention.Save(c.FormId.Value, c.RateTypeId.Value, c.Detentions, userId, transaction);
                            break;
                        case 3:
                            WF_CRTripTonSlab.Save(c.FormId.Value, c.RateTypeId.Value, c.TripTonSlabs, userId, transaction);
                            WF_CRDetention.Save(c.FormId.Value, c.RateTypeId.Value, c.Detentions, userId, transaction);
                            break;
                        case 6:
                            WF_CRFreightKLTon.Save(c.FormId.Value, c.RateTypeId.Value, c.FreightKLTons, userId, transaction);
                            WF_CRDetention.Save(c.FormId.Value, c.RateTypeId.Value, c.Detentions, userId, transaction);
                            break;
                    }
                    WF_CRHandling.Save(c.FormId.Value, c.Handling, userId, transaction);
                    transaction.Commit();
                    return true;
                    //switch (c.RateTypeId)
                    //{
                    //    case 0:
                    //        c.DedicatedRents.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.DedicatedRents.RemoveAll(x => x.Delete);
                    //        c.DedicatedVariables.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.DedicatedVariables.RemoveAll(x => x.Delete);
                    //        c.DedicatedTollTax.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.DedicatedTollTax.RemoveAll(x => x.Delete);
                    //        c.DedicatedKMs.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.DedicatedKMs.RemoveAll(x => x.Delete);
                    //        break;
                    //    case 1:
                    //        c.Trips.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.Trips.RemoveAll(x => x.Delete);
                    //        c.Detentions.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.Detentions.RemoveAll(x => x.Delete);
                    //        break;
                    //    case 3:
                    //        c.TripTonSlabs.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.TripTonSlabs.RemoveAll(x => x.Delete);
                    //        break;
                    //    case 6:
                    //        c.FreightKLTons.ForEach(x => { x.Add = false; x.Edit = false; });
                    //        c.FreightKLTons.RemoveAll(x => x.Delete);
                    //        break;
                    //}
                    //c.Handling.ForEach(x => { x.Add = false; x.Edit = false; });
                    //c.Handling.RemoveAll(x => x.Delete);
                }
            }
            catch(Exception) {
                transaction.Rollback();
                throw;
            }
        }

        internal static bool Submit(Submission submission, string _userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitClientRate");
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, submission.FormId);
                db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, submission.Comments);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, submission.StateId);
                db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, _userId);
                db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, submission.Owner);
                db.AddInParameter(dbCommandDetail, "Approved", SqlDbType.Bit, submission.Approved);
                db.AddInParameter(dbCommandDetail, "Rejected", SqlDbType.Bit, submission.Rejected);
                db.AddInParameter(dbCommandDetail, "IsCompleted", SqlDbType.Bit, submission.Completed);
                db.ExecuteNonQuery(dbCommandDetail);
            }
            catch (Exception) { throw; }
            return true;
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