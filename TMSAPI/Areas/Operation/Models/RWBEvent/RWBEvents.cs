using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class RWBEvents
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short EventId { get; set; }
        public string EventName { get; set; }
        public DateTime? EventDateTime { get; set; }
        public string VehicleNo { get; set; }
        public int KMReading { get; set; }
        public string FromCityName { get; set; }
        public string ToCityName { get; set; }
        public string ConsigneeName { get; set; }
        #endregion

        #region constructor
        public RWBEvents()
        {
        }
        #endregion

        #region internal methods
        internal static List<RWBEvents> Get(string rwbNo, string userId, short companyId)
        {
            try
            {
                List<RWBEvents> events = new List<RWBEvents>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRWBEvents"))
                {
                    db.AddInParameter(dbCommand, "RWBNo", SqlDbType.VarChar, rwbNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                events.Add(new RWBEvents
                                {
                                    EventId = Convert.ToInt16(dr["EventId"]),
                                    EventName = dr["EventName"].ToString(),
                                    EventDateTime = Convert.ToDateTime(dr["EventDateTime"]),
                                    VehicleNo = dr["VehicleNo"].ToString(),
                                    KMReading = Convert.ToInt32(dr["KMReading"]),
                                    FromCityName = dr["FromCityName"].ToString(),
                                    ToCityName = dr["ToCityName"].ToString(),
                                    ConsigneeName = dr["ConsigneeName"].ToString()
                                });
                            }
                        }
                    }
                }
                return events;
            }
            catch (Exception ex) { throw ex; }
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
