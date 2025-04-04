using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WorkOrder : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? WOId { get; set; }
        public string WONo { get; set; }
        public DateTime? WODate { get; set; }
        public short BranchId { get; set; }
        //public string DepartmentCode { get; set; }
        public short VehicleId { get; set; }
        public short? SubCategoryId { get; set; }
        public short? SupplierId { get; set; }
        public double KMsReading { get; set; }
        public double EstDuration { get; set; }
        public short PriorityId { get; set; }
        public int? RequestId { get; set; }
        public string ActivityDetail { get; set; }
        public string Owner { get; set; }
        public bool Completed { get; set; }
        public short StateId { get; set; } = 0;
        public short? CompanyId { get; set; }
        public short WOTypeId { get; set; }
        public string Remarks { get; set; }
        public List<WOActivity> Activities { get; set; } = new List<WOActivity>();
        public List<WOEstInventory> EstInventories { get; set; } = new List<WOEstInventory>();
        public List<WOEstOtherCharges> EstOtherChgs { get; set; } = new List<WOEstOtherCharges>();
        public List<WOInventory> Inventories { get; set; } = new List<WOInventory>();
        public List<WOOtherCharges> OtherCharges { get; set; } = new List<WOOtherCharges>();

        public agFooter Footer { get; set; } = new agFooter();
        //public List<_____WOEstTechnician> EstimatedManPowers { get; set; } = new List<_____WOEstTechnician>();
        //public List<___WOEstSubContractor> EstimatedSubContracts { get; set; } = new List<___WOEstSubContractor>();
        //        public List<___WOTechnician> ActualManPowers { get; set; } = new List<___WOTechnician>();
        //      public List<___WOSubContractor> ActualSubContracts { get; set; } = new List<___WOSubContractor>();
        #endregion

        #region constructor
        public WorkOrder()
        {
        }
        #endregion

        #region internal methods
        internal static WorkOrder Get(string woNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWorkOrderByNo"))
            {
                db.AddInParameter(dbCommand, "WONo", SqlDbType.VarChar, woNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        bool includeActual = Convert.ToBoolean(dr["Completed"]) || 
                            agHelper.InList((agEnums.WorkOrderState)Convert.ToInt16(dr["StateId"]),
                            agEnums.WorkOrderState.SubmittedToWorkShop, agEnums.WorkOrderState.ResolvedByWorkShop,
                            agEnums.WorkOrderState.RejectedByOperation, agEnums.WorkOrderState.AcknowledgedByOperation);
                        return new WorkOrder
                        {
                            WOId = Convert.ToInt32(dr["WoId"]),
                            WONo = woNo,
                            WODate = Convert.ToDateTime(dr["WODate"]),
                            PriorityId = Convert.ToInt16(dr["PriorityId"]),
                            RequestId = agHelper.iDBNull(dr["RequestId"]),
                            VehicleId = Convert.ToInt16(dr["AssetId"]),
                            BranchId = Convert.ToInt16(dr["BranchId"]),                            
                            KMsReading = Convert.ToDouble(dr["KMsReading"]),
                            EstDuration = Convert.ToDouble(dr["EstDuration"]),
                            ActivityDetail = dr["ActivityDetail"].ToString(),
                            WOTypeId = Convert.ToInt16(dr["WOTypeId"]),
                            SubCategoryId = agHelper.sDBNull(dr["SubCategoryId"]),
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            Owner = dr["Owner"].ToString(),
                            Completed = Convert.ToBoolean(dr["Completed"]),
                            Footer = new agFooter(dr),

                            Activities = WOActivity.Get(Convert.ToInt32(dr["WoId"])),
                            EstInventories = WOEstInventory.Get(Convert.ToInt32(dr["WoId"])),
                            EstOtherChgs = WOEstOtherCharges.Get(Convert.ToInt32(dr["WoId"])),

                            Inventories = includeActual ? WOInventory.Get(Convert.ToInt32(dr["WoId"])) : new List<WOInventory>(),
                            OtherCharges = includeActual ? WOOtherCharges.Get(Convert.ToInt32(dr["WoId"])) : new List<WOOtherCharges>()
                            //EstimatedManPowers = _____WOEstTechnician.Get(Convert.ToInt32(dr["WoId"])),
                            //EstimatedSubContracts = ___WOEstSubContractor.Get(Convert.ToInt32(dr["WoId"])),
                            //ActualManPowers = includeActual ? ___WOTechnician.Get(Convert.ToInt32(dr["WoId"])) : new List<___WOTechnician>(),
                            //ActualSubContracts = includeActual ? ___WOSubContractor.Get(Convert.ToInt32(dr["WoId"])) : new List<___WOSubContractor>(),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WorkOrder wo, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWorkOrder"))
                    {
                        db.AddInParameter(dbCommand, "WONo", SqlDbType.VarChar, wo.WONo);
                        db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, wo.WOId);
                        db.AddInParameter(dbCommand, "WODate", SqlDbType.DateTime, wo.WODate);
                        db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, wo.BranchId);
                        db.AddInParameter(dbCommand, "AssetId", SqlDbType.Int, wo.VehicleId);
                        db.AddInParameter(dbCommand, "KMsReading", SqlDbType.Float, wo.KMsReading);
                        db.AddInParameter(dbCommand, "EstDuration", SqlDbType.Float, wo.EstDuration);
                        db.AddInParameter(dbCommand, "PriorityId", SqlDbType.Int, wo.PriorityId);
                        db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, wo.RequestId);
                        db.AddInParameter(dbCommand, "ActivityDetail", SqlDbType.VarChar, wo.ActivityDetail);
                        db.AddInParameter(dbCommand, "WOTypeId", SqlDbType.Int, wo.WOTypeId);
                        db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, wo.SubCategoryId);
                        db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, wo.SupplierId);
                        db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, wo.Remarks);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, wo.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newWOId", SqlDbType.Int, 32);
                        db.AddOutParameter(dbCommand, "newWONo", SqlDbType.VarChar, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        wo.WOId = Convert.ToInt32(dbCommand.Parameters["@newWOId"].Value);
                        wo.WONo = dbCommand.Parameters["@newWONo"].Value.ToString();
                        WOEstInventory.Save(wo.WOId.Value, wo.EstInventories, userId, transaction);
//                        _____WOEstTechnician.Save(wo.WOId.Value, wo.EstimatedManPowers, userId, transaction);
  //                      ___WOEstSubContractor.Save(wo.WOId.Value, wo.EstimatedSubContracts, userId, transaction);
                        WOEstOtherCharges.Save(wo.WOId.Value, wo.EstOtherChgs, userId, transaction);
                        WOActivity.Save(wo.WOId.Value, wo.Activities, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        internal static bool SaveActual(WorkOrder wo, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    WOInventory.Save(wo.WOId.Value, wo.Inventories, userId, transaction);
                    WOOtherCharges.Save(wo.WOId.Value, wo.OtherCharges, userId, transaction);
                    //___WOTechnician.SaveDetail(wo.WOId.Value, wo.ActualManPowers, userId, transaction);
                    //___WOSubContractor.Save(wo.WOId.Value, wo.ActualSubContracts, userId, transaction);
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        internal static bool Submit(Submission sub, string userId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitWorkOrder"))
                {
                    db.AddInParameter(dbCommandDetail, "WOId", SqlDbType.Int, sub.FormId);
                    db.AddInParameter(dbCommandDetail, "Comments", SqlDbType.VarChar, sub.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, sub.StateId);
                    db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, sub.Owner);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.Bit, sub.Completed);
                    db.ExecuteNonQuery(dbCommandDetail);
                }
                return true;
            }
            catch (Exception) { throw; }
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