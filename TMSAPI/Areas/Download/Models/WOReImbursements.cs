using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Download.Models
{
    [DataContract]
    public class WOReImbursements
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties    
        public int? RequestId { get; set; }
        public string Status { get; set; }
        public string WONo { get; set; }   
        public string PeriodName { get; set; }      
        public string AssetNo { get; set; }     
        public string Activity { get; set; }       
        public DateTime WODate { get; set; }       
        public string CategoryName { get; set; }      
        public string SubCatagoryName { get; set; }       
        public string LeaseTypeName { get; set; }       
        public DateTime WOCloseDate { get; set; }       
        public decimal Amount { get; set; }
        #endregion

        #region constructor
        public WOReImbursements()
        {
        }

        public WOReImbursements(string _woNo, string _period, string _assetNo, string _activity,
            DateTime _woDate, string _categoryName, string _subcatagoryName, string _leasetypeName, DateTime _woCloseDate,
            decimal _amount, object _requestId, string _status)
        {
            WONo = _woNo;
            PeriodName = _period;
            AssetNo = _assetNo;
            Activity = _activity;
            WODate = _woDate;
            CategoryName = _categoryName;
            SubCatagoryName = _subcatagoryName;
            LeaseTypeName = _leasetypeName;
            WOCloseDate = _woCloseDate;
            Amount = _amount;
            if (_requestId != DBNull.Value)
                RequestId = Convert.ToInt32(_requestId);
            Status = _status;
        }
        #endregion

        #region internal methods
        internal static List<WOReImbursements> Get(short branchId, short supplierId,
            short subCategoryId, short periodFrom, short periodTo, short companyId, string userId)
        {
            try
            {
                List<WOReImbursements> lstWO = new List<WOReImbursements>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("extWOReImbursement"))
                {
                    db.AddInParameter(dbCommand, "branchId", SqlDbType.SmallInt, branchId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                    //db.AddInParameter(dbCommand, "DepartmentCode", SqlDbType.Char, departmentId);
                    db.AddInParameter(dbCommand, "SubCategoryId", SqlDbType.SmallInt, subCategoryId);
                    db.AddInParameter(dbCommand, "PeriodFrom", SqlDbType.SmallInt, periodFrom);
                    db.AddInParameter(dbCommand, "PeriodTo", SqlDbType.SmallInt, periodTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                lstWO.Add(new WOReImbursements(
                                    dr["WONo"].ToString(),
                                    dr["PeriodName"].ToString(),
                                    dr["AssetNo"].ToString(),
                                    dr["ActivityDetail"].ToString(),
                                    Convert.ToDateTime(dr["WODate"]),
                                    dr["TypeName"].ToString(),
                                    dr["SubCategoryName"].ToString(),
                                    dr["LeaseTypeName"].ToString(),
                                    Convert.ToDateTime(dr["WoCloseDate"]),
                                    Convert.ToDecimal(dr["TotalAmount"]),
                                    dr["RequestId"],
                                    dr["Status"].ToString()));
                            }
                        }
                    }
                }
                return lstWO;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}
