using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvTransfer : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? TransferId { get; set; }
        public DateTime? TransferDate { get; set; } = DateTime.Now.Date;
        public short FromBranchId { get; set; }
        public short ToBranchId { get; set; }
        public short StateId { get; set; } = 0;
        public string StatusName { get; set; }
        public string Owner { get; set; }
        public bool Completed { get; set; } = false;
        public List<InvTransferDetail> Details { get; set; } = new List<InvTransferDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        //public string FromBranchName { get; set; }
        //public string ToBranchName { get; set; }
        #endregion

        #region constructor
        public InvTransfer()
        {
        }
        #endregion

        #region internal methods
        internal static InvTransfer Get(int trfId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvTransferById"))
            {
                db.AddInParameter(dbCommand, "TransferId", SqlDbType.Int, trfId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InvTransfer
                        {
                            TransferId = Convert.ToInt32(dr["TransferId"]),
                            TransferDate = Convert.ToDateTime(dr["TransferDate"]),
                            FromBranchId = Convert.ToInt16(dr["FromBranchId"]), 
                            ToBranchId = Convert.ToInt16(dr["ToBranchId"]),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            Owner = dr["Owner"].ToString(),
                            Completed = Convert.ToBoolean(dr["Completed"]),
                            Details = InvTransferDetail.Get(trfId),
                            Footer = new agFooter(dr),
                            //FromBranchName = dr["FromBranchName"].ToString(),
                            //ToBranchName = dr["ToBranchName"].ToString()
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InvTransfer it, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvTransfer"))
                {
                    db.AddInParameter(dbCommand, "TransferId", SqlDbType.Int, it.TransferId);
                    db.AddInParameter(dbCommand, "TransferDate", SqlDbType.DateTime, it.TransferDate);
                    db.AddInParameter(dbCommand, "FromBranchId", SqlDbType.SmallInt, it.FromBranchId);
                    db.AddInParameter(dbCommand, "ToBranchId", SqlDbType.SmallInt, it.ToBranchId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, it.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newTransferId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    it.TransferId = Convert.ToInt32(dbCommand.Parameters["@newTransferId"].Value);
                    InvTransferDetail.Save(it.TransferId.Value, it.Details, userId, transaction);

                    if (it.StateId == (int)agEnums.WorkFlowState.New)
                    {
                        it.StateId = (int)agEnums.WorkFlowState.Saved;
                        it.Footer.CreatedBy = userId;
                        it.Footer.UpdatedBy = userId;
                        it.Owner = userId;
                    }
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

        internal static bool Transfer(Submission _sub, string UserId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("TransferInventory"))
                {
                    db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, _sub.FormId);
                    db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, _sub.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, _sub.StateId);
                    db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, UserId);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.VarChar, _sub.Completed);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, _sub.Owner);
                    db.ExecuteNonQuery(dbCommandDetail);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Receive(Submission _sub, string UserId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("ReceiveInventory"))
                {
                    db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, _sub.FormId);
                    db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, _sub.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, _sub.StateId);
                    db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, UserId);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.VarChar, _sub.Completed);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, _sub.Owner);
                    db.ExecuteNonQuery(dbCommandDetail);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Cancel(Submission _sub, string UserId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("CancelTranfer"))
                {
                    db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, _sub.FormId);
                    db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, _sub.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, _sub.StateId);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.VarChar, _sub.Completed);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, _sub.Owner);
                    db.ExecuteNonQuery(dbCommandDetail);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
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