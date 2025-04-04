using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Route : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RouteId {get; set;}
        public string RouteName {get; set;}
        public short? OriginId {get; set;}
        public short? DestinationId {get; set;}
        public short? ConsigneeStartPoint { get; set; }
        public short? ConsigneeFinishPoint { get; set; }
        public decimal? StdKMs { get; set; }
        public decimal? StdTT { get; set; }
        public decimal? HillyKMs { get; set; }
        public bool IsActive { get; set; } = true;
        public bool TollTaxApplicable { get; set; } = false;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructors
        public Route()
        {
        }
        #endregion

        #region internal methods
        internal static Route Get(short routeId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRouteById"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "RouteId", SqlDbType.Int, routeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Route
                        {
                            RouteId = Convert.ToInt32(dr["RouteId"]),
                            RouteName = dr["RouteName"].ToString(),
                            OriginId = agHelper.sDBNull(dr["OriginId"]),
                            DestinationId = agHelper.sDBNull(dr["DestinationId"]),
                            ConsigneeStartPoint = agHelper.sDBNull(dr["ShipperId"]),
                            ConsigneeFinishPoint = agHelper.sDBNull(dr["ConsigneeId"]),
                            StdKMs = Convert.ToDecimal(dr["StdKMs"]),
                            StdTT = Convert.ToDecimal(dr["StdTT"]),
                            HillyKMs = Convert.ToDecimal(dr["HillyKms"]),
                            TollTaxApplicable = Convert.ToBoolean(dr["TollTaxApplicable"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Route rt, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRoute"))
                {
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.Int, rt.RouteId);
                    db.AddInParameter(dbCommand, "RouteName", SqlDbType.VarChar, rt.RouteName);
                    db.AddInParameter(dbCommand, "OriginId", SqlDbType.SmallInt, rt.OriginId);
                    db.AddInParameter(dbCommand, "DestinationId", SqlDbType.SmallInt, rt.DestinationId);
                    db.AddInParameter(dbCommand, "ConsigneeStartPoint", SqlDbType.SmallInt, rt.ConsigneeStartPoint);
                    db.AddInParameter(dbCommand, "ConsigneeFinishPoint", SqlDbType.SmallInt, rt.ConsigneeFinishPoint);
                    db.AddInParameter(dbCommand, "StdKMs", SqlDbType.Decimal, rt.StdKMs);
                    db.AddInParameter(dbCommand, "StdTT", SqlDbType.Decimal, rt.StdTT);
                    db.AddInParameter(dbCommand, "HillyKMs", SqlDbType.Decimal, rt.HillyKMs);
                    db.AddInParameter(dbCommand, "TollTaxApplicable", SqlDbType.Bit, rt.TollTaxApplicable);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, rt.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, rt.Footer.UpdatedOn);
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
            //throw new Exception("The method or operation is not implemented.");
            
        }
        #endregion
    }
}