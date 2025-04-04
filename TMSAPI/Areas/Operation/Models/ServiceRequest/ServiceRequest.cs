using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Areas.Common.Models;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class ServiceRequest : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RequestId { get; set; }
        public DateTime? RequestDate { get; set; }
        public short? RequestTypeId { get; set; }
        public short? PriorityId { get; set; }
        public short? VehicleId { get; set; }
        public short? ComplainantId { get; set; }
        public decimal? KMsReading { get; set; }
        public string RequestDetail { get; set; }
        public string RequestorName { get; set; }
        public string Remarks { get; set; }
        public short StateId { get; set; } = 1;
        public string Resolution { get; set; }
        public string Owner { get; set; }
        public bool WORaised { get; set; } = false;
        public short? CompanyId { get; set; }
        public bool Completed { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ServiceRequest()
        {
        }
        #endregion

        #region internal methods
        internal static ServiceRequest Get(int reqId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetServiceRequestById"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, reqId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new ServiceRequest
                        {
                            RequestId = reqId,
                            RequestDate = Convert.ToDateTime(dr["RequestDate"]),
                            RequestTypeId = Convert.ToInt16(dr["RequestTypeId"]),
                            PriorityId = Convert.ToInt16(dr["PriorityId"]),
                            VehicleId = Convert.ToInt16(dr["AssetId"]),
                            KMsReading = agHelper.dDBNull(dr["KMsReading"]),
                            ComplainantId = Convert.ToInt16(dr["ComplainantId"]),
                            RequestorName = dr["RequestorName"].ToString(),
                            RequestDetail = dr["RequestDetail"].ToString(),
                            Remarks = dr["Remarks"].ToString(),
                            Resolution = dr["Resolution"].ToString(),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            Owner = dr["Owner"].ToString(),
                            Completed = Convert.ToBoolean(dr["Completed"]),
                            WORaised = Convert.ToBoolean(dr["WORaised"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ServiceRequest svr, short CompanyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveServiceRequest"))
                {
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, svr.RequestId);
                    db.AddInParameter(dbCommand, "RequestDate", SqlDbType.DateTime, svr.RequestDate); 
                    db.AddInParameter(dbCommand, "RequestTypeId", SqlDbType.Int, svr.RequestTypeId);
                    db.AddInParameter(dbCommand, "PriorityId", SqlDbType.Int, svr.PriorityId);
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.Int, svr.VehicleId);
                    db.AddInParameter(dbCommand, "KMsReading", SqlDbType.Float, svr.KMsReading);
                    db.AddInParameter(dbCommand, "RequestDetail", SqlDbType.VarChar, svr.RequestDetail);
                    db.AddInParameter(dbCommand, "ComplainantId", SqlDbType.Int, svr.ComplainantId);
                    db.AddInParameter(dbCommand, "RequestorName", SqlDbType.VarChar, svr.RequestorName);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, svr.Remarks);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, CompanyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, svr.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newRequestId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand);
                    svr.RequestId = Convert.ToInt32(dbCommand.Parameters["@newRequestId"].Value);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Submit(Submission sub, string userId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitServiceRequest"))
                {
                    db.AddInParameter(dbCommandDetail, "RequestId", SqlDbType.Int, sub.FormId);
                    db.AddInParameter(dbCommandDetail, "Comments", SqlDbType.VarChar, sub.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, sub.StateId);
                    db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, sub.Owner);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.Bit, sub.Completed);
                    db.ExecuteNonQuery(dbCommandDetail);
                }
            }
            catch (Exception) { throw; }
            return true;
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