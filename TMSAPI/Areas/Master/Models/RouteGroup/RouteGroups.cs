using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class RouteGroups
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public int RouteGroupId { get; set; }
        [DataMember(Order = 1)]
        public string RouteGroupName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public RouteGroups()
        {
        }
        #endregion

        #region internal methods
        internal static List<RouteGroups> Get(bool _activeOnly=true)
        {
            List<RouteGroups> groups = new List<RouteGroups>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetRouteGroups");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        groups.Add(new RouteGroups
                        {
                            RouteGroupId = Convert.ToInt32(dr["RouteGroupId"]),
                            RouteGroupName = dr["RouteGroupName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return groups;
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
