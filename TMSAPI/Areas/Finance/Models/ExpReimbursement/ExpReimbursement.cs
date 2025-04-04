using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ExpReimbursement : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RequestId { get; set; }
        //public string BaseStationId { get; set; }
        public short BranchId { get; set; }
        public short? PeriodFromId { get; set; }
        public short? PeriodToId { get; set; }
        //public bool Completed { get; set; }
        public List<ExpReimbursementDetail> Details { get; set; } = new List<ExpReimbursementDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ExpReimbursement()
        {
        }
        #endregion

        #region internal methods
        internal static ExpReimbursement Get(int requestId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetExpReimbursementById"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new ExpReimbursement
                        {
                            RequestId = requestId,
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            PeriodFromId = Convert.ToInt16(dr["PeriodFromId"]),
                            PeriodToId = Convert.ToInt16(dr["PeriodToId"]),
                            //Completed = Convert.ToBoolean(dr["Completed"]),
                            Details = ExpReimbursementDetail.Get(requestId),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ExpReimbursement er, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveExpReimbursement"))
                {
                    //db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, er.RequestId);
                    db.AddInParameter(dbCommand, "BranchId", SqlDbType.VarChar, er.BranchId);
                    db.AddInParameter(dbCommand, "PeriodFromId", SqlDbType.VarChar, er.PeriodFromId);
                    db.AddInParameter(dbCommand, "PeriodToId", SqlDbType.VarChar, er.PeriodToId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    //db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, er.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "NewRequestId", SqlDbType.VarChar, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    er.RequestId = Convert.ToInt16(dbCommand.Parameters["@NewRequestId"].Value);
                    ExpReimbursementDetail.Save(er.RequestId.Value, er.Details, transaction);
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

        //internal static bool Complete(int requestId, string userId)
        //{
        //    try
        //    {
        //        DbCommand dbCommandDetail = db.GetStoredProcCommand("CompleteExpReimbursement");
        //        db.AddInParameter(dbCommandDetail, "RequestId", SqlDbType.SmallInt, requestId);
        //        db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
        //        db.ExecuteNonQuery(dbCommandDetail);
        //        return true;
        //    }
        //    catch (Exception) { throw; }
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