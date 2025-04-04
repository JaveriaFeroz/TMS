using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class DriverReference
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public string ReferenceName { get; set; }
        public string  CNIC { get; set; }
        public string CompanyName { get; set; }
        public short RelationId { get; set; }
        public string Address { get; set; }
        public string ContactNo { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public DriverReference()
        {

        }
        #endregion

        #region internal methods
        internal static List<DriverReference> Get(int driverId)
        {
            List<DriverReference> references = new List<DriverReference>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverReferencesById"))
            {
                db.AddInParameter(dbCommand, "DriverId", SqlDbType.SmallInt, driverId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            references.Add(new DriverReference
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ReferenceName = dr["ReferenceName"].ToString(),
                                CNIC = dr["CNIC"].ToString(),
                                CompanyName = dr["CompanyName"].ToString(),
                                RelationId = Convert.ToInt16(dr["RelationId"]),
                                Address = dr["Address"].ToString(),
                                ContactNo = dr["ContactNo"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return references;
        }

        internal static bool Save(int? driverid, List<DriverReference> details, string userId, DbTransaction transaction)
        {
            
            foreach (DriverReference dr in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriverReference"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, dr.DetailId);
                    db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverid);
                    db.AddInParameter(dbCommand, "ReferenceName", SqlDbType.VarChar, dr.ReferenceName);
                    db.AddInParameter(dbCommand, "CNIC", SqlDbType.VarChar, dr.CNIC);
                    db.AddInParameter(dbCommand, "CompanyName", SqlDbType.VarChar, dr.CompanyName);
                    db.AddInParameter(dbCommand, "RelationId", SqlDbType.SmallInt, dr.RelationId);
                    db.AddInParameter(dbCommand, "Address", SqlDbType.VarChar, dr.Address);
                    db.AddInParameter(dbCommand, "ContactNo", SqlDbType.VarChar, dr.ContactNo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               dr.Delete ? "D" : (dr.Add ? "I" : "U")));

                    db.ExecuteNonQuery(dbCommand, transaction);

                }
            }
            return true;
        }
        #endregion
    }
}
