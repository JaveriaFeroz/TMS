using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Inventory.Models
{
    public class GRN : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? GRNId { get; set; }
        public string GRNNo { get; set; }
        public DateTime? GRNDate { get; set; }
        public int? PONo { get; set; }
        public short? SupplierId { get; set; }
        public short BranchId { get; set; }
        public short MoPId { get; set; } = 2; //default to Account
        public short GRNTypeId { get; set; } = 1; //default to Fresh receipt
        public string RefNo { get; set; }
        public DateTime? RefDate { get; set; }
        public List<GRNDetail> Details { get; set; } = new List<GRNDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public GRN()
        {

        }
        #endregion

        #region internal methods
        internal static GRN Get(string grnNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGRNByNo"))
            {
                db.AddInParameter(dbCommand, "GRNNo", SqlDbType.VarChar, grnNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new GRN {
                            GRNId = Convert.ToInt32(dr["GRNId"]),
                            GRNNo = grnNo,
                            GRNDate = Convert.ToDateTime(dr["GRNDate"]),
                            PONo = agHelper.iDBNull(dr["PONo"]),
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            GRNTypeId = Convert.ToInt16(dr["GRNTypeId"]),
                            MoPId = Convert.ToInt16(dr["PaymentModeId"]),
                            BranchId = Convert.ToInt16(dr["BranchId"]),
                            RefNo = dr["RefNo"].ToString(),
                            RefDate = agHelper.dtDBNull(dr["RefDate"]),
                            Details = GRNDetail.Get(Convert.ToInt32(dr["GRNId"])),
                        Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(GRN grn, short companyid, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGRN"))
                {
                    //db.AddInParameter(dbCommand, "GRNNo", SqlDbType.Int, grn.GRNNo);
                    db.AddInParameter(dbCommand, "GRNDate", SqlDbType.DateTime, grn.GRNDate);
                    db.AddInParameter(dbCommand, "PONo", SqlDbType.Int, grn.PONo);
                    db.AddInParameter(dbCommand, "GRNTypeId", SqlDbType.VarChar, grn.GRNTypeId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.Int, grn.SupplierId);
                    db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, grn.BranchId);
                    db.AddInParameter(dbCommand, "PaymentModeId", SqlDbType.VarChar, grn.MoPId);
                    db.AddInParameter(dbCommand, "RefNo", SqlDbType.VarChar, grn.RefNo);
                    db.AddInParameter(dbCommand, "RefDate", SqlDbType.DateTime, grn.RefDate);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyid);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newGRNId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    grn.GRNId = Convert.ToInt32(dbCommand.Parameters["@newGRNId"].Value);
                    GRNDetail.Save(grn.GRNId.Value, grn.Details, userId, transaction);
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