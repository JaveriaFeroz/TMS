using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Shipper : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ShipperId { get; set; }
        public string ShipperName { get; set; }
        public string Address { get; set; }
        public short? CityId { get; set; }
        public short? ClientId { get; set; }
        public string ContactNo { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructors
        public Shipper()
		{
        }
        #endregion

        #region internal methods
        internal static Shipper Get(int shipperId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetShipperById"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "ShipperId", SqlDbType.SmallInt, shipperId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Shipper
                        {
                            ShipperId = shipperId,
                            ShipperName = dr["ShipperName"].ToString(),
                            Address = dr["ShipperAddress"].ToString(),
                            CityId = agHelper.sDBNull(dr["CityId"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            ContactNo = dr["ContactNo"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Shipper _s, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveShipper"))
                {
                    db.AddInParameter(dbCommand, "ShipperId", SqlDbType.SmallInt, _s.ShipperId);
                    db.AddInParameter(dbCommand, "ShipperName", SqlDbType.VarChar, _s.ShipperName);
                    db.AddInParameter(dbCommand, "ShipperAddress", SqlDbType.VarChar, _s.Address);
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, _s.CityId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _s.ClientId);
                    db.AddInParameter(dbCommand, "ContactNo", SqlDbType.VarChar, _s.ContactNo);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _s.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _s.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region disposable method
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}