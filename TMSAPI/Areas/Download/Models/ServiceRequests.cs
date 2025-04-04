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
    public class ServiceRequests
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string AssetNo { get; set; }
        public int RequestId { get; set; }
        public string RequestDate { get; set; }
        public string PriorityName { get; set; }
        public string ServiceDetail { get; set; }
        public string ComplainantName { get; set; }
        public string RequestorName { get; set; }
        public string Remarks { get; set; }
        public string StateName { get; set; }
        public string Owner { get; set; }
        public string DelayHrs { get; set; }
        public string Createdby { get; set; }
        public string Createdon { get; set; }
        #endregion

        #region constructor
        public ServiceRequests()
        {
        }
        #endregion

        #region internal methods
        internal static List<ServiceRequests> GetPending(DateTime dateFrom, DateTime dateTo, short companyId, string userId)
        {
            try
            {
                List<ServiceRequests> requests = new List<ServiceRequests>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("extPendingServiceRequest"))
                {
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);

                    using DataSet ds = db.ExecuteDataSet(dbCommand);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            requests.Add(new ServiceRequests
                            {
                                AssetNo = dr["AssetNo"].ToString(),
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                RequestDate = dr["RequestDate"].ToString(),
                                PriorityName = dr["PriorityName"].ToString(),
                                ServiceDetail = dr["RequestDetail"].ToString(),
                                ComplainantName = dr["ComplainantName"].ToString(),
                                RequestorName = dr["RequestorName"].ToString(),
                                Remarks = dr["Remarks"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                Owner = dr["Owner"].ToString(),
                                DelayHrs = dr["DelayHRs"].ToString(),
                                Createdby = dr["Createdby"].ToString(),
                                Createdon = dr["Createdon"].ToString()
                            });
                        }
                    }
                }
                return requests;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}