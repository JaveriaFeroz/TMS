using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class ExpReimbursementDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //        public int? DetailId { get; set; }
        //      public bool Selected { get; set; }
        public int RwbId { get; set; }
        public string JobNo { get; set; }
        public string RwbNo { get; set; }
        public string RouteName { get; set; }
        public string AssetNo { get; set; }
        public string ClientName { get; set; }
        public string SupplierName { get; set; }
        public double FuelAvg { get; set; }
        public string DepatureDateTime { get; set; }
        public string ArrivalDateTime { get; set; }
        public string JobClosureDateTime { get; set; }
        public string PeriodName { get; set; }
        public double Amount { get; set; }     
        #endregion

        #region constructor
        public ExpReimbursementDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<ExpReimbursementDetail> Get(int requestId)
        {
            List<ExpReimbursementDetail> details = new List<ExpReimbursementDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetExpReimbursementDetailById"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new ExpReimbursementDetail
                            {
                                //DetailId = Convert.ToInt32(dr["DetailId"]),
                                RwbId = Convert.ToInt32(dr["RwbId"]),
                                JobNo = dr["JobNo"].ToString(),
                                RwbNo = dr["RwbNo"].ToString(),
                                RouteName = dr["RouteName"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                SupplierName = dr["SupplierName"].ToString(),
                                FuelAvg = Convert.ToDouble(dr["KMPerLitre"]),
                                DepatureDateTime = dr["DepartureDateTime"].ToString(),
                                ArrivalDateTime = dr["ArrivalDateTime"].ToString(),
                                JobClosureDateTime = dr["JobClosureDateTime"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                //Selected = Convert.ToBoolean(dr["Paid"]),
                                Amount = Convert.ToDouble(dr["Amount"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        /// <summary>
        /// returns list of RWBs that are not yet reimbursed
        /// </summary>
        /// <param name="branchCode"></param>
        /// <param name="periodFromId"></param>
        /// <param name="periodToId"></param>
        /// <param name="companyId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        internal static List<ExpReimbursementDetail> Get(short branchId, short periodFromId, short periodToId, short companyId, string userId)
        {
            List<ExpReimbursementDetail> details = new List<ExpReimbursementDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetExpReimbursementPending"))
            {
                db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, branchId);
                db.AddInParameter(dbCommand, "PeriodFromId", SqlDbType.SmallInt, periodFromId);
                db.AddInParameter(dbCommand, "PeriodToId", SqlDbType.SmallInt, periodToId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new ExpReimbursementDetail
                            {
                                //DetailId = Convert.ToInt32(dr["DetailId"]),
                                RwbId = Convert.ToInt32(dr["RwbId"]),
                                RwbNo = dr["RwbNo"].ToString(),
                                JobNo = dr["JobNo"].ToString(),
                                RouteName = dr["RouteName"].ToString(),
                                AssetNo = dr["AssetNo"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                SupplierName = dr["SupplierName"].ToString(),
                                FuelAvg = Convert.ToDouble(dr["KMPerLitre"]),
                                DepatureDateTime = dr["DepartureDateTime"].ToString(),
                                ArrivalDateTime = dr["ArrivalDateTime"].ToString(),
                                JobClosureDateTime = dr["JobClosureDateTime"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                //Selected = Convert.ToBoolean(dr["Paid"]),
                                Amount = Convert.ToDouble(dr["TotalExpense"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int requestId, List<ExpReimbursementDetail> details, DbTransaction transaction)
        {
            foreach (ExpReimbursementDetail erd in details)//agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveExpReimbursementDetail"))
                {                   
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                    db.AddInParameter(dbCommand, "RWBId", SqlDbType.VarChar, erd.RwbId);
                    //db.AddInParameter(dbCommand, "Paid", SqlDbType.Bit, erd.Selected);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, erd.Amount);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
