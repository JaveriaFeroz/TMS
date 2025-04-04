using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    public class Shippers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public int ShipperId { get; set; }       
        public string ShipperName { get; set; }      
        public short ClientId { get; set; }
        public string ClientName { get; set; }
        public bool IsActive { get; set; }
        //public double LastDeliveryKMs { get; set; }
        //public DateTime? LastDepartureDate { get; set; }
        //public DateTime? LastDepartureTime { get; set; }
        //public DateTime? LastDepartureDateTime { get; set; }
        //public double? StandardKMs { get; set; }
        #endregion

        #region constructor
        public Shippers()
        {
        }
        #endregion

        #region internal methods
        internal static List<Shippers> Get(short companyId, bool _activeOnly=true)
        {
            List<Shippers> Shippers = new List<Shippers>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetShippers");
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        Shippers.Add(new Shippers
                        {
                            ShipperId = Convert.ToInt32(dr["ShipperId"]),
                            ShipperName = dr["ShipperName"].ToString(),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            ClientName = dr["ClientName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return Shippers;
        }

        internal static List<Shippers> GetByRWB(int RwbId)
        {
            List<Shippers> Shippers = new List<Shippers>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetRWBShippers");
            db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, RwbId);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        Shippers.Add(new Shippers
                        {
                            ShipperId = Convert.ToInt32(dr["ShipperId"]),
                            ShipperName = dr["ShipperName"].ToString(),
                            //LastDeliveryKMs = Convert.ToInt32(dr["LastDeliveryKms"]),
                            //LastDepartureDate = Convert.ToDateTime(dr["LastDepartureDate"]),
                            //LastDepartureTime = Convert.ToDateTime(dr["LastDepartureTime"]),
                            //LastDepartureDateTime = Convert.ToDateTime(dr["LastDepartureDateTime"]),
                            //StandardKMs = Convert.ToDouble(dr["StandardKMs"])
                        });
                    }
                }
            }
            return Shippers;
        }

        internal static List<Shippers> GetByClientId(short _clientId)
        {
            List<Shippers> shippers = new List<Shippers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetShippersByClientId"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.Int, _clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            shippers.Add(new Shippers
                            {
                                ShipperId = Convert.ToInt32(dr["ShipperId"]),
                                ShipperName = dr["ShipperName"].ToString()
                            });
                        }
                    }
                }
            }
            return shippers;
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
