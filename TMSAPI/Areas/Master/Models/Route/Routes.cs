using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Routes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public int RouteId { get; set; }       
        public string RouteName { get; set; }
        public short? OriginId { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Routes()
        {
        }
        #endregion

        #region internal methods
        internal static List<Routes> Get(short companyId, bool _activeOnly=true)
        {
            List<Routes> routes = new List<Routes>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetRoutes");
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        routes.Add(new Routes
                        {
                            RouteId = Convert.ToInt32(dr["RouteId"]),
                            RouteName = dr["RouteName"].ToString(),
                            OriginId = agHelper.sDBNull(dr["OriginId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return routes;
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