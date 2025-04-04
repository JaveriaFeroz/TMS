using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvAdjustment : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? AdjId { get; set; }
        public DateTime? AdjDate { get; set; } = DateTime.Now.Date;
        public short BranchId { get; set; }
        public short? CompanyId { get; set; }
        public List<InvAdjustmentDetail> Details { get; set; } = new List<InvAdjustmentDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InvAdjustment()
        {
        }
        #endregion

        #region internal methods
        internal static InvAdjustment Get(int adjId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvAdjById"))
            {
                db.AddInParameter(dbCommand, "AdjId", SqlDbType.Int, adjId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InvAdjustment
                        {
                            AdjId = Convert.ToInt32(dr["AdjId"]),
                            AdjDate = Convert.ToDateTime(dr["AdjDate"]),
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            Footer = new agFooter(dr),
                            Details = InvAdjustmentDetail.Get(adjId),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InvAdjustment invAdj, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvAdj"))
                {
                    db.AddInParameter(dbCommand, "AdjId", SqlDbType.Int, invAdj.AdjId);
                    db.AddInParameter(dbCommand, "AdjDate", SqlDbType.DateTime, invAdj.AdjDate);
                    db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, invAdj.BranchId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    //db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, invAdj.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newAdjId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    invAdj.AdjId = Convert.ToInt32(dbCommand.Parameters["@newAdjId"].Value);
                    InvAdjustmentDetail.Save(invAdj.AdjId.Value, invAdj.Details, userId, transaction);
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
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}