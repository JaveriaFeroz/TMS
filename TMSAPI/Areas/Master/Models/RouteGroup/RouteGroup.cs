using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    //this may require revisit later
    public class RouteGroup : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructors
        public RouteGroup()
        {
        }
        #endregion

        #region internal methods
        internal static RouteGroup Get(short groupId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRouteGroupById"))
            {
                db.AddInParameter(dbCommand, "RouteGroupId", SqlDbType.SmallInt, groupId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new RouteGroup
                        {
                            GroupId = Convert.ToInt16(dr["RouteGroupId"]),
                            GroupName = dr["RouteGroupName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(RouteGroup rg, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRouteGroup"))
                {
                    db.AddInParameter(dbCommand, "RouteGroupId", SqlDbType.SmallInt, rg.GroupId);
                    db.AddInParameter(dbCommand, "RouteGroupName", SqlDbType.VarChar, rg.GroupName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, rg.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, rg.Footer.UpdatedOn);
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