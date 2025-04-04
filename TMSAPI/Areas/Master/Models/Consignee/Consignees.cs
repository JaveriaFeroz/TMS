using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    public class Consignees
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public int ConsigneeId { get; set; }       
        public string ConsigneeName { get; set; }      
        public short ClientId { get; set; }        
        public bool IsActive { get; set; }
        public double LastDeliveryKMs { get; set; }
        public DateTime? LastDepartureDate { get; set; }
        public DateTime? LastDepartureTime { get; set; }
        public DateTime? LastDepartureDateTime { get; set; }
        public double? StandardKMs { get; set; }
        #endregion

        #region constructor
        public Consignees()
        {
        }
        #endregion

        #region internal methods
        internal static List<Consignees> Get(short companyId, bool _activeOnly=true)
        {
            List<Consignees> consignees = new List<Consignees>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetConsignees");
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        consignees.Add(new Consignees
                        {
                            ConsigneeId = Convert.ToInt32(dr["ConsigneeId"]),
                            ConsigneeName = dr["ConsigneeName"].ToString(),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return consignees;
        }

        internal static List<Consignees> GetByRWB(int RwbId)
        {
            List<Consignees> consignees = new List<Consignees>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetRWBEventConsignees");
            db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, RwbId);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        consignees.Add(new Consignees
                        {
                            ConsigneeId = Convert.ToInt32(dr["ConsigneeId"]),
                            ConsigneeName = dr["ConsigneeName"].ToString(),
                            LastDeliveryKMs = Convert.ToInt32(dr["LastDeliveryKms"]),
                            LastDepartureDate = Convert.ToDateTime(dr["LastDepartureDate"]),
                            LastDepartureTime = Convert.ToDateTime(dr["LastDepartureTime"]),
                            LastDepartureDateTime = Convert.ToDateTime(dr["LastDepartureDateTime"]),
                            StandardKMs = Convert.ToDouble(dr["StdKM"])
                        });
                    }
                }
            }
            return consignees;
        }

        internal static List<Consignees> GetByClientId(short _clientId)
        {
            List<Consignees> consignees = new List<Consignees>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetConsigneesByClientId"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.Int, _clientId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            consignees.Add(new Consignees
                            {
                                ConsigneeId = Convert.ToInt32(dr["ConsigneeId"]),
                                ConsigneeName = dr["ConsigneeName"].ToString()
                            });
                        }
                    }
                }
            }
            return consignees;
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
