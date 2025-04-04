using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class VehicleGroup : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; } = true;  
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public VehicleGroup()
        {
        }
        #endregion

        #region internal methods
        internal static VehicleGroup Get(short _groupId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetVehicleGroupById"))
            {
                db.AddInParameter(dbCommand, "GroupId", SqlDbType.SmallInt, _groupId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new VehicleGroup
                        {
                            GroupId = Convert.ToInt16(dr["GroupId"]),
                            GroupName = dr["GroupName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(VehicleGroup _vg, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveVehicleGroup"))
                {
                    db.AddInParameter(dbCommand, "GroupId", SqlDbType.SmallInt, _vg.GroupId);
                    db.AddInParameter(dbCommand, "GroupName", SqlDbType.VarChar, _vg.GroupName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _vg.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _vg.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region idispose method
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}