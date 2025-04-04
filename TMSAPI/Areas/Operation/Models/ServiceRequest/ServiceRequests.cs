using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class ServiceRequests
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int RequestId { get; set; }
        public string RequestDate { get; set; }
        public string RequestTypeName { get; set; }
        public string PriorityName { get; set; }
        public string VehicleNo { get; set; }
        public string StateName { get; set; }
        public string ComplainantName { get; set; }
        #endregion

        #region constructor
        public ServiceRequests()
        {
        }
        #endregion

        #region internal methods
        internal static List<ServiceRequests> Get(short companyId, string userId)
        {
            List<ServiceRequests> requests = new List<ServiceRequests>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetServiceRequests"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            requests.Add(new ServiceRequests
                            {
                                RequestId = Convert.ToInt32(dr["RequestId"]),
                                RequestDate = dr["RequestDate"].ToString(),
                                RequestTypeName = dr["RequestTypeName"].ToString(),
                                PriorityName = dr["PriorityName"].ToString(),
                                VehicleNo = dr["AssetNo"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                ComplainantName = dr["ComplainantName"].ToString()
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