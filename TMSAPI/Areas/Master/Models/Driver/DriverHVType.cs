using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Master.Models
{
    public class DriverHVType
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short HeavyVehicleTypeId { get; set; }
        public bool IsEnabled { get; set; }
        public string HeavyVehicleTypeName { get; set; }
        #endregion

        #region constructor
        public DriverHVType()
        {

        }

        public DriverHVType(object _DetailId, short _HeavyVehicleTypeId, string _HeavyVehicleTypeName, bool _isEnabled)
        {
            if (_DetailId != DBNull.Value)
                DetailId = Convert.ToInt32(_DetailId);
            HeavyVehicleTypeId = _HeavyVehicleTypeId;
            HeavyVehicleTypeName = _HeavyVehicleTypeName;
            IsEnabled = _isEnabled;
        }
        #endregion

        #region internal methods
        internal static List<DriverHVType> Get(int driverid)
        {
            List<DriverHVType> lstD = new List<DriverHVType>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetDriverHVTypeById"))
                {
                    db.AddInParameter(dbCommandDetail, "DriverId", SqlDbType.Int, driverid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                lstD.Add(new DriverHVType(
                                   dr["DetailId"],
                                   Convert.ToInt16(dr["HeavyVehicleTypeId"]),
                                    dr["HeavyVehicleTypeName"].ToString(),
                                    Convert.ToBoolean(dr["IsEnabled"])));
                            }
                        }
                    }
                }
                return lstD;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int? driverid, List<DriverHVType> DHT, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (DriverHVType dht in getDriverHVTypeChanges(DHT))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriverHVType"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, dht.DetailId);
                        db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverid);
                        db.AddInParameter(dbCommand, "HeavyVehicleTypeId", SqlDbType.Int, dht.HeavyVehicleTypeId);
                        db.AddInParameter(dbCommand, "IsEnabled", SqlDbType.Bit, dht.IsEnabled);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);

                        db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);

                        db.ExecuteNonQuery(dbCommand, transaction);

                        // woActivity.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                    }
                }
            }
            catch (Exception) { throw; }
            return true;
        }
        #endregion

        #region private methods
        private static IEnumerable<DriverHVType> getDriverHVTypeChanges(List<DriverHVType> _DHT)
        {
            return _DHT.Where(a => (a.IsEnabled && !a.DetailId.HasValue) || (!a.IsEnabled && a.DetailId.HasValue));
        }
        #endregion
    }
}