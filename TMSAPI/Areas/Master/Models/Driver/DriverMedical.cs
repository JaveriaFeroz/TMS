using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class DriverMedical
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short TestId { get; set; }
        public DateTime? TestDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Remarks { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public DriverMedical()
        {
        }
        #endregion

        #region internal methods
        internal static List<DriverMedical> Get(int driverid)
        {
            List<DriverMedical> tests = new List<DriverMedical>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverMedicalsbyId"))
            {
                db.AddInParameter(dbCommand, "DriverId", SqlDbType.SmallInt, driverid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            tests.Add(new DriverMedical
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                TestId = Convert.ToInt16(dr["TestId"]),
                                TestDate = agHelper.dtDBNull(dr["TestDate"]),
                                DueDate = agHelper.dtDBNull(dr["DueDate"]),
                                Remarks = dr["Remarks"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return tests;
        }

        internal static bool Save(int? driverid, List<DriverMedical> details, string userId, DbTransaction transaction)
        {
            foreach (DriverMedical dmt in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriverMedical"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, dmt.DetailId);
                    db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverid);
                    db.AddInParameter(dbCommand, "TestId", SqlDbType.SmallInt, dmt.TestId);
                    db.AddInParameter(dbCommand, "TestDate", SqlDbType.DateTime, dmt.TestDate);
                    db.AddInParameter(dbCommand, "DueDate", SqlDbType.DateTime, dmt.DueDate);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, dmt.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               dmt.Delete ? "D" : (dmt.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}