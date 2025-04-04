using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class GeoFenceEmail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ClientId { get; set; }
        public string EmailTo { get; set; }
        public string EmailCC { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public GeoFenceEmail()
        {
        }
        #endregion

        #region internal methods
        internal static List<GeoFenceEmail> Get(short fenceid)
        {
            List<GeoFenceEmail> emails = new List<GeoFenceEmail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGeoFenceEmailsById"))
            {
                db.AddInParameter(dbCommand, "FenceId", SqlDbType.SmallInt, fenceid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            emails.Add(new GeoFenceEmail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ClientId = Convert.ToInt16(dr["ClientId"]),
                                EmailTo = dr["EmailTo"].ToString(),
                                EmailCC = dr["EmailCC"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return emails;
        }

        internal static bool Save(int? fenceId, List<GeoFenceEmail> details, string userId, DbTransaction transaction)
        {
            foreach (GeoFenceEmail gfe in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGeoFenceEmail"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, gfe.DetailId);
                    db.AddInParameter(dbCommand, "FenceId", SqlDbType.Int, fenceId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, gfe.ClientId);
                    db.AddInParameter(dbCommand, "EmailTo", SqlDbType.VarChar, gfe.EmailTo);
                    db.AddInParameter(dbCommand, "EmailCC", SqlDbType.VarChar, gfe.EmailCC);                   
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          gfe.Delete ? "D" : (gfe.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}