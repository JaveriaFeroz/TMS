using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class JobFuel
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? SupplierId { get; set; }
        public short? CardId { get; set; }
        public string SlipNo { get; set; }
        public DateTime? SlipDate { get; set; }
        public decimal Qty { get; set; }
        public decimal Rate { get; set; }
        public decimal KMReading { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public JobFuel()
        {
        }
        #endregion

        #region internal methods
        internal static List<JobFuel> GetForVehicle(int _jobId)
        {
            return get("GetJobFuelById", _jobId);
        }

        internal static List<JobFuel> GetForGenset(int _jobId)
        {
            return get("GetJobGensetFuelById", _jobId);
        }

        internal static bool SaveForVehicle(int jobId, List<JobFuel> details, string userId, DbTransaction transaction)
        {
            return save("SaveJobFuel", jobId, details, userId, transaction);
        }

        internal static bool SaveForGenset(int jobId, List<JobFuel> details, string userId, DbTransaction transaction)
        {
            return save("SaveJobFuelGenset", jobId, details, userId, transaction);
        }
        #endregion

        #region private methods
        private static List<JobFuel> get(string _spName, int _jobId)
        {
            List<JobFuel> fuel = new List<JobFuel>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(_spName))
            {
                db.AddInParameter(dbCommand, "JobId", SqlDbType.Int, _jobId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            fuel.Add(new JobFuel
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                CardId = agHelper.sDBNull(dr["CardId"]),
                                SlipNo = dr["SlipNo"].ToString(),
                                SlipDate = Convert.ToDateTime(dr["SlipDate"]),
                                Qty = Convert.ToDecimal(dr["Qty"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                KMReading = Convert.ToDecimal(dr["KMReading"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return fuel;
        }

        private static bool save(string _spName, int jobId, List<JobFuel> details, string userId, DbTransaction transaction)
        {
            foreach (JobFuel jf in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand(_spName))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, jf.DetailId);
                    db.AddInParameter(dbCommand, "JobId", SqlDbType.Int, jobId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, jf.SupplierId);
                    db.AddInParameter(dbCommand, "CardId", SqlDbType.Decimal, jf.CardId);
                    db.AddInParameter(dbCommand, "SlipNo", SqlDbType.VarChar, jf.SlipNo);
                    db.AddInParameter(dbCommand, "SlipDate", SqlDbType.DateTime, jf.SlipDate); 
                    db.AddInParameter(dbCommand, "Qty", SqlDbType.Decimal, jf.Qty);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, jf.Rate);
                    db.AddInParameter(dbCommand, "KMReading", SqlDbType.Decimal, jf.KMReading);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          jf.Delete ? "D" : (jf.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}