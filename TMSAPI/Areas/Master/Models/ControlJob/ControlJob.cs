using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class ControlJob : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string Period { get; set; }
        public string RevenueJobNo { get; set; }
        public string CostJobNo { get; set; }
        public string MaintenanceJobNo { get; set; }
        public agFooter Footer { get; set; } = new agFooter();       
        #endregion

        #region constructors
        public ControlJob()
        {
        }
        #endregion

        #region internal methods
        internal static ControlJob Get(short companyId)
        {
            using DbCommand dbCommand = db.GetStoredProcCommand("GetControlJobsByPeriod");
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
            using DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0];
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                return new ControlJob
                {
                    Period = dr["Period"].ToString(),
                    RevenueJobNo = dr["RevenueJobNo"].ToString(),
                    CostJobNo = dr["CostJobNo"].ToString(),
                    MaintenanceJobNo = dr["MaintenanceCostJobNo"].ToString(),
                    Footer = new agFooter(dr)
                };
            }
            else
                return null;
        }

        internal static bool Save(ControlJob cj, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveControlJob"))
                {
                    db.AddInParameter(dbCommand, "Period", SqlDbType.VarChar, cj.Period);
                    db.AddInParameter(dbCommand, "RevenueJobNo", SqlDbType.VarChar, cj.RevenueJobNo);
                    db.AddInParameter(dbCommand, "CostJobNo", SqlDbType.VarChar, cj.CostJobNo);
                    db.AddInParameter(dbCommand, "MaintenanceCostJobNo", SqlDbType.VarChar, cj.MaintenanceJobNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, cj.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            
        }
        #endregion
    }
}