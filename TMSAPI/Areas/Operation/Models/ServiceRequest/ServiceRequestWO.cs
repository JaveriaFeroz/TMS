using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Operation.Models
{
    [DataContract]
    public class ServiceRequestForWO : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RequestId { get; set; }
        public DateTime? RequestDate { get; set; }
        public short VehicleId { get; set; }
        public string VehicleNo { get; set; }
        public short PriorityId { get; set; }
        public string PriorityName { get; set; }
        public short BranchId { get; set; }
        public string BranchName { get; set; }
        public double KMsReading { get; set; }
        public string RequestDetail { get; set; }
        #endregion

        #region constructor
        public ServiceRequestForWO()
        {
        }
        #endregion

        #region internal methods
        internal static List<ServiceRequestForWO> Get(short companyId, string userId)
        {
            List<ServiceRequestForWO> requests = new List<ServiceRequestForWO>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetServiceRequestsForWO"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            requests.Add(new ServiceRequestForWO
                            {
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                RequestDate = Convert.ToDateTime(dr["RequestDate"]),
                                VehicleId = Convert.ToInt16(dr["AssetId"]),
                                VehicleNo = dr["AssetNo"].ToString(),
                                PriorityId = Convert.ToInt16(dr["PriorityId"]),
                                PriorityName = dr["PriorityName"].ToString(),
                                BranchId = Convert.ToInt16(dr["BranchId"]),
                                BranchName = dr["BranchName"].ToString(),
                                KMsReading = Convert.ToDouble(dr["KMsReading"]),
                                RequestDetail = dr["RequestDetail"].ToString()
                            });
                        }
                    }
                }
            }
            return requests;
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