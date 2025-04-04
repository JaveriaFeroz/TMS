using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Region : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RegionId { get; set; }
        public string RegionName { get; set; }
        public double TaxRate { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Region()
        {          
        }
        #endregion

        #region internal methods
        internal static Region Get(short regionId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRegionById"))
            {
                db.AddInParameter(dbCommand, "RegionId", SqlDbType.TinyInt, regionId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Region
                        {
                            RegionId = Convert.ToInt16(dr["RegionId"]),
                            TaxRate = Convert.ToDouble(dr["TaxRate"]),
                            RegionName = dr["RegionName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Region region, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRegion"))
                {
                    db.AddInParameter(dbCommand, "RegionId", SqlDbType.TinyInt, region.RegionId);
                    db.AddInParameter(dbCommand, "RegionName", SqlDbType.VarChar, region.RegionName);
                    db.AddInParameter(dbCommand, "TaxRate", SqlDbType.Float, region.TaxRate);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, region.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, region.Footer.UpdatedOn);
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