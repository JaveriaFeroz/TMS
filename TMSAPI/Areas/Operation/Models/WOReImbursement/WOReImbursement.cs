using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOReImbursement : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RequestId { get; set; }
        public short PeriodFromId { get; set; }
        public short PeriodToId { get; set; }
        public short BranchId { get; set; }        
        public short? SupplierId { get; set; }
        public short? SubCategoryId { get; set; }
        public short? LeaseTypeId { get; set; }
        //public string PeriodFromName { get; set; }
        //public string PeriodToName { get; set; }
        public bool Closed { get; set; } = false;
        public List<WOReImbursementDetail> Details { get; set; } = new List<WOReImbursementDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public WOReImbursement()
        {
        }
        #endregion

        #region internal methods
        internal static WOReImbursement Get(int requestId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOReImbursementByRequestId"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        using (WOReImbursement wor = new WOReImbursement())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            wor.RequestId = requestId;
                            wor.PeriodFromId = Convert.ToInt16(dr["PeriodFromId"]);
                            wor.PeriodToId = Convert.ToInt16(dr["PeriodToId"]);
                            //wor.PeriodFromName = dr["PeriodFromName"].ToString();
                            //wor.PeriodToName = dr["PeriodToName"].ToString();
                            wor.BranchId = Convert.ToInt16(dr["BranchId"]);
                            wor.SupplierId = Convert.ToInt16(dr["SupplierId"]);
                            wor.SubCategoryId = agHelper.sDBNull(dr["SubCategoryId"]);
                            wor.LeaseTypeId = Convert.ToInt16(dr["LeaseTypeId"]);
                            wor.Closed = Convert.ToBoolean(dr["Closed"]);
                            wor.Details = WOReImbursementDetail.Get(requestId, userId);
                            wor.Footer = new agFooter(dr);
                            return wor;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WOReImbursement wor, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOReImbursement"))
                    {
                        db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, wor.RequestId);
                        db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, wor.BranchId);
                        db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, wor.SupplierId);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, wor.SubCategoryId);
                        db.AddInParameter(dbCommand, "LeaseTypeId", SqlDbType.SmallInt, wor.LeaseTypeId);
                        db.AddInParameter(dbCommand, "PeriodFromId", SqlDbType.SmallInt, wor.PeriodFromId);
                        db.AddInParameter(dbCommand, "PeriodToId", SqlDbType.SmallInt, wor.PeriodToId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, wor.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newRequestId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        wor.RequestId = Convert.ToInt32(dbCommand.Parameters["@newRequestId"].Value);
                        WOReImbursementDetail.Save(wor.RequestId.Value, wor.Details, transaction);
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

        internal static bool Close(int requestNo, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("CloseWOReImbursement");
                db.AddInParameter(dbCommandDetail, "RequestId", SqlDbType.Int, requestNo);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId); 
                db.ExecuteNonQuery(dbCommandDetail);
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