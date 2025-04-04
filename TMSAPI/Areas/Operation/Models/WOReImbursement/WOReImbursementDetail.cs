using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Runtime.Serialization;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    [DataContract]
    public class WOReImbursementDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public bool Selected { get; set; }
        public int WOId { get; set; }
        public string WONo { get; set; }
        public string WODate { get; set; }
        public string PeriodName { get; set; }
        public string AssetNo { get; set; }
        public string ActivityName { get; set; }
        public string CategoryName { get; set; }
        public string WOCloseDate { get; set; }
        public decimal Amount { get; set; }
        //this temporary filed identify if this work order was already selected in recall or selected now
        public short? WOKey { get; set; }
        #endregion

        #region constructor
        public WOReImbursementDetail()
        {

        }
        #endregion

        #region internal methods
        internal static List<WOReImbursementDetail> Get(int requestId, string userId)
        {
            List<WOReImbursementDetail> details = new List<WOReImbursementDetail>();
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("GetWOReImbursementDetailById");
                db.AddInParameter(dbCommandDetail, "RequestId", SqlDbType.Int, requestId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new WOReImbursementDetail
                            {
                                Selected = Convert.ToBoolean(dr["Selected"]),
                                WOId = Convert.ToInt32(dr["WOId"]),
                                WONo = dr["WONo"].ToString(),
                                WODate = dr["WODate"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                ActivityName = dr["ActivityDetail"].ToString(),
                                CategoryName = dr["CategoryName"].ToString(),
                                WOCloseDate = dr["WoCloseDate"].ToString(),
                                Amount = Convert.ToDecimal(dr["Amount"]),
                                WOKey = agHelper.sDBNull(dr["WOKey"])
                            });
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static List<WOReImbursementDetail> GetForReImbursement(short branchId, short supplierId,
            short companyId, short subCategoryId, short periodFromId, short periodToId, short leaseTypeId, string userId)
        {
            try
            {
                List<WOReImbursementDetail> details = new List<WOReImbursementDetail>();
                DbCommand dbCommand = db.GetStoredProcCommand("GetWOsForReImbursement");
                db.AddInParameter(dbCommand, "branchId", SqlDbType.SmallInt, branchId);
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, subCategoryId);
                db.AddInParameter(dbCommand, "PeriodFromId", SqlDbType.SmallInt, periodFromId);
                db.AddInParameter(dbCommand, "PeriodToId", SqlDbType.SmallInt, periodToId);
                db.AddInParameter(dbCommand, "LeaseTypeId", SqlDbType.TinyInt, leaseTypeId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new WOReImbursementDetail
                            {
                                Selected = Convert.ToBoolean(dr["Selected"]),
                                WOId = Convert.ToInt32(dr["WOId"]),
                                WONo = dr["WONo"].ToString(),
                                WODate = dr["WODate"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                ActivityName = dr["ActivityDetail"].ToString(),
                                CategoryName = dr["CategoryName"].ToString(),
                                WOCloseDate = dr["WoCloseDate"].ToString(),
                                Amount = Convert.ToDecimal(dr["Amount"]),
                                WOKey = agHelper.sDBNull(dr["WOKey"])
                            });
                            }
                        }
                    }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int requestId, List<WOReImbursementDetail> details, DbTransaction transaction)
        {
            foreach (WOReImbursementDetail word in getChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOReimbursementDetail"))
                {
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                    db.AddInParameter(dbCommand, "Selected", SqlDbType.Bit, word.Selected);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, word.WOId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, word.Amount);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }

        private static IEnumerable<WOReImbursementDetail> getChanges(List<WOReImbursementDetail> _details)
        {
            return _details.Where(a => (a.Selected && !a.WOKey.HasValue) || (!a.Selected && a.WOKey.HasValue));
        }
        #endregion
    }
}