using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class FuelPaymentReq : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RequestId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public short? SupplierId { get; set; }
        public bool IsCardPayment { get; set; } = false;
        public short? CardId { get; set; }        
        public List<FuelPaymentReqDetail> Details { get; set; } = new List<FuelPaymentReqDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public FuelPaymentReq()
        {
        }
        #endregion

        #region internal methods
        internal static FuelPaymentReq Get(short requestId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelPaymentById"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.SmallInt, requestId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new FuelPaymentReq
                        {
                            RequestId = requestId,
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            IsCardPayment = Convert.ToBoolean(dr["IsCardPayment"]),
                            CardId = agHelper.sDBNull(dr["CardId"]),
                            DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                            DateTo = Convert.ToDateTime(dr["DateTo"]),
                            Details = FuelPaymentReqDetail.Get(requestId),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(FuelPaymentReq fp, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFuelPayment"))
                {
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, fp.RequestId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, fp.SupplierId);
                    db.AddInParameter(dbCommand, "IsCardPayment", SqlDbType.SmallInt, fp.IsCardPayment);
                    db.AddInParameter(dbCommand, "CardId", SqlDbType.SmallInt, fp.CardId);
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, fp.DateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, fp.DateTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, fp.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "NewRequestId", SqlDbType.VarChar, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    fp.RequestId = Convert.ToInt32(dbCommand.Parameters["@NewRequestId"].Value);
                    FuelPaymentReqDetail.Save(fp.RequestId.Value, fp.Details, transaction);
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

        //internal static bool Complete(short requestId, string userId)
        //{
        //    try
        //    {
        //        DbCommand dbCommandDetail = db.GetStoredProcCommand("CompleteFuelPaymentReq");
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