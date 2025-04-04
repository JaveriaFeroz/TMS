using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWB : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public int? RWBId { get; set; }
        public string RWBNo { get; set; }
        public DateTime? RWBDate { get; set; }
        public string JobNo { get; set; }
        public short? ClientId { get; set; }
        public short? ShipperId { get; set; }
        public short? ConsigneeId { get; set; }
        public short? RouteId { get; set; }
        public short? CapacityId { get; set; }
        public string CapacityName { get; set; }
        public short? PaymentModeId { get; set; }
        public short? CategoryId { get; set; }
        public decimal? StartKMs { get; set; }
        public decimal? EndKMs { get; set; }
        public short? Pkgs { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Weight_Excess { get; set; }
        public decimal Weight_Carried { get; set; }
        public decimal Weight_Delivered { get; set; }
        public short? RateTypeId { get; set; }
        public short? ChargeTypeId { get; set; }
        public decimal? DetHRs { get; set; }
        public short? DetGraceHRs { get; set; }
        public short? WayTypeId { get; set; }
        public string GatePassNo { get; set; }
        public string CustomerOrderNo { get; set; }
        public string TDRNo { get; set; }
        public string LinkedRWBNo { get; set; }
        public bool EmptyTrip { get; set; }
        public bool MultiDrop { get; set; }
        public bool OutSourced { get; set; }
        public short? StateId { get; set; }
        public string StateName { get; set; }
        public string Comments { get; set; }
        public short? AssetId { get; set; }
        public string RentedAssetId { get; set; }
        //public decimal? Rate { get; set; }
        //public double? RatePerKm { get; set; }
        //public decimal? LoadingCharges { get; set; }
        //public decimal? OffLoadingCharges { get; set; }
        //public decimal? RateExcessWeightPerKg { get; set; }
        //public decimal? DetentionCharges { get; set; }
        public bool CategoryMandatory { get; set; } = false;
        public bool ProductMandatory { get; set; } = false;
        public short? VehicleCapacity { get; set; }
        public List<RWBCharge> Charges { get; set; } = new List<RWBCharge>();
        public List<RWBSKU> SKUs { get; set; } = new List<RWBSKU>();
        public List<RWBConsignee> Consignees { get; set; } = new List<RWBConsignee>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public RWB()
        {
        }
        #endregion

        #region internal methods
        internal static RWB Get(string rwbNo, short companyId, string userid)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBByNo"))
            {
                db.AddInParameter(dbCommand, "RwbNo", SqlDbType.VarChar, rwbNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new RWB
                        {
                            RWBId = Convert.ToInt32(dr["RWBId"]),
                            RWBNo = rwbNo,
                            RWBDate = Convert.ToDateTime(dr["RWBDate"]),
                            JobNo = dr["JobNo"].ToString(),
                            CapacityId = Convert.ToInt16(dr["CapacityId"]),
                            CapacityName = dr["CapacityName"].ToString(),
                            EmptyTrip = Convert.ToBoolean(dr["EmptyTrip"]),
                            OutSourced = Convert.ToBoolean(dr["OutSourced"]),
                            ClientId = agHelper.sDBNull(dr["ClientId"]),
                            ShipperId = agHelper.sDBNull(dr["ShipperId"]),
                            ConsigneeId = agHelper.sDBNull(dr["ConsigneeId"]),
                            PaymentModeId = agHelper.sDBNull(dr["PaymentModeId"]),
                            CategoryId = agHelper.sDBNull(dr["CategoryId"]),
                            RouteId = agHelper.sDBNull(dr["RouteId"]),
                            StartKMs = Convert.ToDecimal(dr["StartKms"]),
                            GatePassNo = dr["GatePassNo"].ToString(),
                            CustomerOrderNo = dr["CustomerOrderNo"].ToString(),
                            WayTypeId = agHelper.sDBNull(dr["WayTypeId"]),
                            TDRNo = dr["TDRNo"].ToString(),
                            LinkedRWBNo = dr["LinkedRwbNo"].ToString(),
                            RateTypeId = agHelper.sDBNull(dr["RateTypeId"]),
                            Pkgs = agHelper.sDBNull(dr["Pkgs"]),
                            Weight = agHelper.dDBNull(dr["Weight"]),
                            Weight_Excess = agHelper.dDBNull(dr["Weight_Excess"]),
                            DetHRs = agHelper.dDBNull(dr["DetHRs"]),
                            DetGraceHRs = agHelper.sDBNull(dr["DetGraceHRs"]),
                            //Rate = Convert.ToDecimal(dr["Rate"]),
                            //DetentionCharges = agHelper.dDBNull(dr["DetentionCharges"]),
                            //LoadingCharges = agHelper.dDBNull(dr["LoadingCharges"]),
                            //OffLoadingCharges = agHelper.dDBNull(dr["OffLoadingCharges"]),
                            VehicleCapacity = agHelper.sDBNull(dr["Carriage"]),
                            MultiDrop = Convert.ToBoolean(dr["MultiDrop"]),
                            ProductMandatory = Convert.ToBoolean(dr["ProductMandatory"]),
                            CategoryMandatory = Convert.ToBoolean(dr["CategoryMandatory"]),
                            AssetId = agHelper.sDBNull(dr["AssetId"]),
                            RentedAssetId = dr["RentedAssetId"].ToString(),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            StateName = dr["StateName"].ToString(),
                            Charges = RWBCharge.Get(Convert.ToInt32(dr["RWBId"])),
                            SKUs = RWBSKU.Get(Convert.ToInt32(dr["RWBId"])),
                            Consignees = RWBConsignee.Get(Convert.ToInt32(dr["RWBId"])),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static RWB GetForUpdate(string rwbNo, short companyId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBForUpdateByNo"))
                {
                    db.AddInParameter(dbCommand, "RwbNo", SqlDbType.VarChar, rwbNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.Int, companyId);
                    using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                    {
                        if (dt.Rows.Count > 0)
                        {
                            DataRow dr = dt.Rows[0];
                            return new RWB
                            {
                                RWBId = Convert.ToInt32(dr["RWBId"]),
                                RWBNo = rwbNo,
                                ClientId = Convert.ToInt16(dr["ClientId"]),
                                ShipperId = agHelper.sDBNull(dr["ShipperId"]),
                                ConsigneeId = agHelper.sDBNull(dr["ConsigneeId"]),
                                CategoryId = agHelper.sDBNull(dr["CategoryId"]),
                                CategoryMandatory = Convert.ToBoolean(dr["CategoryMandatory"]),
                                ProductMandatory = Convert.ToBoolean(dr["ProductMandatory"]),
                                GatePassNo = dr["GatePassNo"].ToString(),
                                CustomerOrderNo = dr["CustomerOrderNo"].ToString(),
                                Weight_Carried = Convert.ToDecimal(dr["Weight_Carried"]),
                                Weight_Delivered = Convert.ToDecimal(dr["Weight_Delivered"]),
                                VehicleCapacity = Convert.ToInt16(dr["VehicleCapacity"]),
                                MultiDrop = Convert.ToBoolean(dr["MultiDrop"]),
                                SKUs = RWBSKU.Get(Convert.ToInt32(dr["RWBId"])),
                                Consignees = RWBConsignee.Get(Convert.ToInt32(dr["RWBId"]))
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(RWB rwb, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWB"))
                    {
                        db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwb.RWBId);
                        db.AddInParameter(dbCommand, "JobNo", SqlDbType.VarChar, rwb.JobNo);
                        db.AddInParameter(dbCommand, "RWBDate", SqlDbType.DateTime, rwb.RWBDate);
                        db.AddInParameter(dbCommand, "EmptyTrip", SqlDbType.Bit, rwb.EmptyTrip);
                        db.AddInParameter(dbCommand, "OutSourced", SqlDbType.Bit, rwb.OutSourced);
                        db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, rwb.CapacityId);
                        db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, rwb.ClientId);
                        db.AddInParameter(dbCommand, "ShipperId", SqlDbType.SmallInt, rwb.ShipperId);
                        db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.SmallInt, rwb.ConsigneeId);
                        db.AddInParameter(dbCommand, "CategoryId", SqlDbType.TinyInt, rwb.CategoryId);
                        db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, rwb.RouteId);
                        db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.SmallInt, rwb.RateTypeId);
                        db.AddInParameter(dbCommand, "Pkgs", SqlDbType.SmallInt, rwb.Pkgs);
                        db.AddInParameter(dbCommand, "Weight", SqlDbType.Decimal, rwb.Weight);
                        db.AddInParameter(dbCommand, "Weight_Excess", SqlDbType.Decimal, rwb.Weight_Excess);
                        db.AddInParameter(dbCommand, "DetHRs", SqlDbType.Decimal, rwb.DetHRs);
                        db.AddInParameter(dbCommand, "DetGraceHRs", SqlDbType.TinyInt, rwb.DetGraceHRs);
                        //db.AddInParameter(dbCommand, "RwbStatusId", SqlDbType.TinyInt, rwb.StateId);
                        db.AddInParameter(dbCommand, "GatePassNo", SqlDbType.VarChar, rwb.GatePassNo);
                        db.AddInParameter(dbCommand, "CustomerOrderNo", SqlDbType.VarChar, rwb.CustomerOrderNo);
                        db.AddInParameter(dbCommand, "WayTypeId", SqlDbType.SmallInt, rwb.WayTypeId);
                        db.AddInParameter(dbCommand, "TDRNo", SqlDbType.VarChar, rwb.TDRNo);
                        db.AddInParameter(dbCommand, "LinkedRWBNo", SqlDbType.VarChar, rwb.LinkedRWBNo);
                        db.AddInParameter(dbCommand, "PaymentModeId", SqlDbType.VarChar, rwb.PaymentModeId);
                        //db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, rwb.EmptyTrip ? 0 : rwb.Rate);
                        //db.AddInParameter(dbCommand, "loadingcharges", SqlDbType.Decimal, rwb.EmptyTrip ? 0 : rwb.LoadingCharges);
                        //db.AddInParameter(dbCommand, "offloadingcharges", SqlDbType.Decimal, rwb.EmptyTrip ? 0 : rwb.OffLoadingCharges);
                        //db.AddInParameter(dbCommand, "detentioncharges", SqlDbType.Decimal, rwb.EmptyTrip ? 0 : rwb.DetentionCharges);
                        db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, rwb.AssetId);
                        db.AddInParameter(dbCommand, "RentedAssetId", SqlDbType.VarChar, rwb.RentedAssetId);
                        db.AddInParameter(dbCommand, "MultiDrop", SqlDbType.Bit, rwb.MultiDrop);
                        //db.AddInParameter(dbCommand, "VehicleCapacity", SqlDbType.SmallInt, rwb.VehicleCapacity);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, rwb.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newRwbId", SqlDbType.Int, 32);
                        db.AddOutParameter(dbCommand, "newRwbNo", SqlDbType.VarChar, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        rwb.RWBId = Convert.ToInt32(dbCommand.Parameters["@newRwbId"].Value);
                        rwb.RWBNo = dbCommand.Parameters["@newRwbNo"].Value.ToString();
                        RWBCharge.Save(rwb.RWBId.Value, rwb.Charges, userId, transaction);
                        RWBSKU.Save(rwb.RWBId.Value, rwb.SKUs, userId, transaction);
                        RWBConsignee.Save(rwb.RWBId.Value, rwb.Consignees, userId, transaction);
                        transaction.Commit();
                        return true;                       
                    }
                }
                catch (Exception ex) { transaction.Rollback(); throw ex; }
            }
        }

        internal static bool Update(RWB rwb, short companyId, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRWBUpdates"))
                    {
                        db.AddInParameter(dbCommand, "RWBId", SqlDbType.Int, rwb.RWBId);
                        db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.SmallInt, rwb.ConsigneeId);
                        db.AddInParameter(dbCommand, "CategoryId", SqlDbType.SmallInt, rwb.CategoryId);
                        db.AddInParameter(dbCommand, "GatePassNo", SqlDbType.VarChar, rwb.GatePassNo);
                        db.AddInParameter(dbCommand, "CustomerOrderNo", SqlDbType.VarChar, rwb.CustomerOrderNo);
                        db.AddInParameter(dbCommand, "Weight_Carried", SqlDbType.Decimal, rwb.Weight_Carried);
                        db.AddInParameter(dbCommand, "Weight_Delivered", SqlDbType.Decimal, rwb.Weight_Delivered);
                        db.AddInParameter(dbCommand, "Comments", SqlDbType.VarChar, rwb.Comments);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                    RWBSKU.Save(rwb.RWBId.Value, rwb.SKUs, userId, transaction);
                    RWBConsignee.Save(rwb.RWBId.Value, rwb.Consignees, userId, transaction);
                    transaction.Commit();
                    return true;
                }
                catch (Exception) { transaction.Rollback(); throw; }
            }
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