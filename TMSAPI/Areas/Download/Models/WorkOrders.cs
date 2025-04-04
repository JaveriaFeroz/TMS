using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Runtime.Serialization;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Download.Models
{
    [DataContract]
    public class WorkOrders
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? SVRNo { get; set; }
        public string PriorityName { get; set; }
        public string AssetNo { get; set; }
        public Decimal KMs { get; set; }
        public string BranchName { get; set; }
        public string WONo { get; set; }
        public DateTime WODate { get; set; }
        public string StatusName { get; set; }
        public string CategoryName { get; set; }
        public Decimal? Quantity { get; set; }
        public Decimal? Price { get; set; }
        public Decimal? Amount { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public string Flag { get; set; }
        public string SubCatagoryName { get; set; }
        public string LeaseTypeName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public DateTime? WOClosedOn { get; set; }
        //public string DepartmentName { get; set; }
        public Decimal Duration { get; set; }
        public string Activity { get; set; }
        public string Sender { get; set; }
        public string Owner { get; set; }
        public string Completed { get; set; }
        public string DelayHrs { get; set; }
        public string CreatedBy { get; set; }
        #endregion

        #region constructor
        public WorkOrders()
        {
        }

        public WorkOrders(int? _svrNo, string _priorityName, string _assetNo, decimal _kms, string _branchName,
            string _woNo, DateTime _woDate, string _statusName, string _categoryName, decimal? _quantity, decimal? _price,
            decimal? _amount, int? _productId, string _productName,
            string flag, string subCatagoryName, string leaseTypeName, DateTime _createdOn, DateTime? _updatedOn, DateTime? _woClosedOn,
             decimal _duration, string _activity, string _sender, string _owner, string _completed,
            string _delayHrs, string _createdBy)
        {
            WONo = _woNo;
            ProductId = _productId;
            WODate = _woDate;
            ProductName = _productName;
            Quantity = _quantity;
            Price = _price;
            Amount = _amount;
            BranchName = _branchName;
            AssetNo = _assetNo;
            KMs = _kms;
            PriorityName = _priorityName;
            SVRNo = _svrNo;
            Duration = _duration;
            Activity = _activity;
            Sender = _sender;
            Owner = _owner;
            Completed = _completed;
            StatusName = _statusName;
            CategoryName = _categoryName;
            DelayHrs = _delayHrs;
            CreatedBy = _createdBy;
            CreatedOn = _createdOn;
            UpdatedOn = _updatedOn;
            LeaseTypeName = leaseTypeName;
            Flag = flag;
            SubCatagoryName = subCatagoryName;
            WOClosedOn = _woClosedOn;
        }


        #endregion

        #region internal methods
        internal static List<WorkOrders> GetClosed(short periodFromId, short periodToId, short companyId, string userId)
        {
            try
            {
                return get("extClosedWorkOrder", periodFromId, periodToId, null, null, companyId, userId);
            }
            catch (Exception) { throw; }
        }

        internal static List<WorkOrders> GetPending(DateTime dateFrom, DateTime dateTo, short companyId, string userId)
        {
            try
            {
                return get("extPendingWorkOrder", null, null, dateFrom, dateTo, companyId, userId);
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region private methods
        private static List<WorkOrders> get(string spName, short? periodFromId, short? periodToId,
            DateTime? dateFrom, DateTime? dateTo, short companyId, string userId)
        {
            try
            {
                List<WorkOrders> lstWO = new List<WorkOrders>();
                using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    if (periodFromId != null)
                    {
                        db.AddInParameter(dbCommand, "PeriodFrom", SqlDbType.VarChar, periodFromId);
                        db.AddInParameter(dbCommand, "PeriodTo", SqlDbType.VarChar, periodToId);
                    }
                    else
                    {
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                        //db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                        //db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                    }

                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                WorkOrders ico = new WorkOrders(
                                    chkInt32(dr["SVRNo"]),
                                    dr["PriorityName"].ToString(),
                                    dr["AssetNo"].ToString(),
                                    Convert.ToDecimal(dr["KMsReading"]),
                                    dr["BranchName"].ToString(),
                                    dr["WoNo"].ToString(),
                                    Convert.ToDateTime(dr["WODate"]),
                                    dr["StateName"].ToString(),
                                    dr["TypeName"].ToString(),
                                    chkDecimal(dr["Quantity"]),
                                    chkDecimal(dr["Price"]),
                                    chkDecimal(dr["Quantity"]) * chkDecimal(dr["Price"]),
                                    chkInt32(dr["ProductId"]),
                                    dr["ProductName"].ToString(),
                                    dr["Flag"].ToString(),
                                    dr["SubCategoryName"].ToString(),
                                    dr["LeaseTypeName"].ToString(),
                                    Convert.ToDateTime(dr["CreatedOn"]),
                                    Convert.ToDateTime(dr["UpdatedOn"]),
                                    agHelper.dtDBNull(dr["WoCloseDate"]),
                                    Convert.ToDecimal(dr["EstDuration"]),
                                    dr["ActivityDetail"].ToString(),
                                    dr["Sender"].ToString(),
                                    dr["Owner"].ToString(),
                                    dr["Completed"].ToString(),
                                     dr["DelayHours"].ToString(),
                                    dr["CreatedBy"].ToString());
                                lstWO.Add(ico);
                            }
                        }
                    }
                }
                return lstWO;
            }
            catch (Exception) { throw; }
        }

        //private static List<WorkOrders> getOpenWorkOrderExtract(DateTime dateFrom, DateTime dateTo,
        //string departmentcode, string userId, string spName)
        //{
        //    try
        //    {
        //        List<WorkOrders> lCO = new List<WorkOrders>();
        //        using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
        //        {
        //            db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
        //            db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
        //            db.AddInParameter(dbCommand, "DepartmentCode", SqlDbType.VarChar, departmentcode);
        //            db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);

        //            dbCommand.CommandTimeout = 600;
        //            using (DataSet ds = db.ExecuteDataSet(dbCommand))
        //            {
        //                if (ds != null && ds.Tables.Count > 0)
        //                {
        //                    foreach (DataRow dr in ds.Tables[0].Rows)
        //                    {
        //                        WorkOrders ico = new WorkOrderExtract(
        //                            chkInt32(dr["ServiceRequestNo"]),
        //                            dr["PriorityName"].ToString(),
        //                            dr["AssetNo"].ToString(),
        //                            Convert.ToDecimal(dr["CurrentKmReading"]),
        //                            dr["BranchName"].ToString(),
        //                            Convert.ToInt32(dr["WoNo"]),
        //                            Convert.ToDateTime(dr["WODate"]),
        //                            dr["StateName"].ToString(),
        //                            dr["DocumentTypeName"].ToString(),
        //                            chkDecimal(dr["Quantity"]),
        //                            chkDecimal(dr["Price"]),
        //                            chkDecimal(dr["Quantity"]) *
        //                            chkDecimal(dr["Price"]),
        //                            chkInt32(dr["ProductId"]),
        //                            dr["ProductName"].ToString(),
        //                            dr["Flag"].ToString(),
        //                            dr["SubCategoryName"].ToString(),
        //                            dr["LeaseTypeName"].ToString(),
        //                            Convert.ToDateTime(dr["CreatedOn"]),
        //                            Convert.ToDateTime(dr["UpdatedOn"]),
        //                            null,
        //                            dr["DepartmentName"].ToString(),
        //                            Convert.ToDecimal(dr["EstimatedDuration"]),
        //                            dr["ActivityDetail"].ToString(),
        //                            dr["Sender"].ToString(),
        //                            dr["Owner"].ToString(),
        //                            dr["Completed"].ToString(),
        //                             dr["DelayHours"].ToString(),
        //                            dr["CreatedBy"].ToString());
        //                        lCO.Add(ico);
        //                    }
        //                }
        //            }
        //        }
        //        return lCO;
        //    }
        //    catch (Exception) { throw; }
        //}

        private static int? chkInt32(object o)
        {
            if (o == DBNull.Value)
                return null;
            else
                return Convert.ToInt32(o);
        }

        private static decimal? chkDecimal(object o)
        {
            if (o == DBNull.Value)
                return null;
            else
                return Convert.ToDecimal(o);
        }
        #endregion
    }
}
