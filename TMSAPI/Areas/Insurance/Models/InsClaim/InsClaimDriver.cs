using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsClaimDriver : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DriverId { get; set; } 
        public string DriverName { get; set; }       
        public string CNIC { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InsClaimDriver()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsClaimDriver> Get(int claimId)
        {
            List<InsClaimDriver> drivers = new List<InsClaimDriver>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriversByClaimId"))
            {
                db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            drivers.Add(new InsClaimDriver
                            {
                                DriverId = Convert.ToInt32(dr["DriverId"]),
                                DriverName = dr["DriverName"].ToString(),
                                CNIC = dr["CNIC"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return drivers;
        }

        internal static bool Save(int claimId, List<InsClaimDriver> details, string userId, DbTransaction transaction)
        {
            foreach (InsClaimDriver icd in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsClaimDriver"))
                {
                    db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, icd.DriverId);
                    db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                    db.AddInParameter(dbCommand, "DriverName", SqlDbType.VarChar, icd.DriverName);
                    db.AddInParameter(dbCommand, "CNIC", SqlDbType.VarChar, icd.CNIC); 
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                       icd.Delete ? "D" : (icd.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}