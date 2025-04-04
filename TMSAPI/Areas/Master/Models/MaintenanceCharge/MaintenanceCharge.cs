using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class MaintenanceCharge : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ChargeId { get; set; }
        public string ChargeName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public MaintenanceCharge()
        { }
        #endregion

        #region internal methods
        internal static MaintenanceCharge Get(short ChargeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetMaintenanceChargeById"))
            {
                db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, ChargeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new MaintenanceCharge
                        {
                            ChargeId = Convert.ToInt16(dr["ChargeId"]),
                            ChargeName = dr["ChargeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(MaintenanceCharge mc, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveMaintenanceCharge"))
                {
                    db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, mc.ChargeId);
                    db.AddInParameter(dbCommand, "ChargeName", SqlDbType.VarChar, mc.ChargeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, mc.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, mc.Footer.UpdatedOn);
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
            // no implementation
        }
        #endregion
    }
}