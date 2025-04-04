using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class City : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? CityId { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public short? RegionId { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public City()
        {
        }
        #endregion

        #region internal methods
        internal static City Get(int cityId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCityById"))
            {
                db.AddInParameter(dbCommand, "CityId", SqlDbType.Int, cityId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new City
                        {
                            CityId = Convert.ToInt32(dr["CityId"]),
                            CityCode = dr["CityCode"].ToString(),
                            CityName = dr["CityName"].ToString(),
                            RegionId = Convert.ToInt16(dr["RegionId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(City c, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCity"))
                {
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.Int, c.CityId);
                    db.AddInParameter(dbCommand, "CityCode", SqlDbType.VarChar, c.CityCode);
                    db.AddInParameter(dbCommand, "CityName", SqlDbType.VarChar, c.CityName);
                    db.AddInParameter(dbCommand, "RegionId", SqlDbType.SmallInt, c.RegionId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, c.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
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