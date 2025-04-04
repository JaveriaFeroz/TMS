using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class GeoFence : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? FenceId { get; set; }
        public string FenceName { get; set; }
        public short CityId { get; set; }
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public decimal Radius { get; set; }
        public bool IsActive { get; set; }
        public List<GeoFenceEmail> Details { get; set; } = new List<GeoFenceEmail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public GeoFence()
        {
         
        }
        #endregion

        #region internal methods
        internal static GeoFence Get(short fenceId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGeoFenceById"))
            {
                db.AddInParameter(dbCommand, "FenceId", SqlDbType.Int, fenceId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new GeoFence
                        {
                            FenceId = fenceId,
                            FenceName = dr["FenceName"].ToString(),
                            CityId = Convert.ToInt16(dr["CityId"]),
                            Latitude = Convert.ToDecimal(dr["Latitude"]),
                            Longitude = Convert.ToDecimal(dr["Longitude"]),
                            Radius = Convert.ToDecimal(dr["Radius"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr),
                            Details = GeoFenceEmail.Get(fenceId),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(GeoFence g, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGeoFence"))
                    {
                        db.AddInParameter(dbCommand, "FenceId", SqlDbType.SmallInt, g.FenceId);
                        db.AddInParameter(dbCommand, "FenceName", SqlDbType.VarChar, g.FenceName);
                        db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, g.CityId);
                        db.AddInParameter(dbCommand, "Latitude", SqlDbType.Decimal, g.Latitude);
                        db.AddInParameter(dbCommand, "Longitude", SqlDbType.Decimal, g.Longitude);
                        db.AddInParameter(dbCommand, "Radius", SqlDbType.Decimal, g.Radius);
                        db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, g.IsActive);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.Bit, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, g.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newFenceId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        g.FenceId = Convert.ToInt16(dbCommand.Parameters["@newFenceId"].Value);
                        GeoFenceEmail.Save(g.FenceId, g.Details, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception) { transaction.Rollback(); throw; }
            }
        }
        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            //db = null;
        }

        #endregion
    }
}