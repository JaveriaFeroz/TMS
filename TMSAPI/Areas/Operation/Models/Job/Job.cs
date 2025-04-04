using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class Job : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? JobId { get; set; }
        public string JobNo { get; set; }
        public DateTime? JobDate { get; set; }
        public decimal? Advance { get; set; }
        public decimal? CashReturned { get; set; }
        public DateTime? JobStartDate { get; set; }
        public DateTime? JobStartTime { get; set; }
        public DateTime? JobCloseDate { get; set; }
        public DateTime? JobCloseTime { get; set; }
        public decimal? CloseKMs { get; set; }
        public short? StateId { get; set; }
        public string StateName { get; set; }
        public decimal? FuelLtrs { get; set; }
        public bool Outsourced { get; set; }
        public bool HasGenset { get; set; }
        public decimal? GensetFuelLtrs { get; set; }
        public decimal? GensetCashReturned { get; set; }
        public short? CompanyId { get; set; }
        public List<JobFuel> VehicleFuel { get; set; } = new List<JobFuel>();
        public List<JobFuel> GenSetFuel { get; set; } = new List<JobFuel>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Job()
        {
        }
        #endregion

        #region internal methods
        internal static Job Get(string jobNo, short companyId)
        {
            using DbCommand dbCommand = db.GetStoredProcCommand("GetJobByNo");
            db.AddInParameter(dbCommand, "JobNo", SqlDbType.VarChar, jobNo);
            db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                {
                    DataRow dr = ds.Tables[0].Rows[0];
                    return new Job
                    {
                        JobId = Convert.ToInt32(dr["JobId"]),
                        JobNo = jobNo,
                        JobDate = Convert.ToDateTime(dr["JobDate"]),
                        Advance = Convert.ToDecimal(dr["Advance"]),
                        JobStartDate = Convert.ToDateTime(dr["JobStartDate"]),
                        JobStartTime = Convert.ToDateTime(dr["JobStartTime"]),
                        StateId = Convert.ToInt16(dr["StateId"]),
                        StateName = dr["StateName"].ToString(),
                        Footer = new agFooter(dr)
                    };
                }
                else
                    return null;
            }
        }

        internal static Job GetForClosure(string jobNo, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetJobByNo"))
            {
                db.AddInParameter(dbCommand, "JobNo", SqlDbType.VarChar, jobNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Job
                        {
                            JobNo = jobNo,
                            JobId = Convert.ToInt32(dr["JobId"]),
                            JobDate = Convert.ToDateTime(dr["JobDate"]),
                            Advance = agHelper.dDBNull(dr["Advance"]),
                            JobStartDate = Convert.ToDateTime(dr["JobStartDate"]),
                            JobStartTime = Convert.ToDateTime(dr["JobStartTime"]),
                            JobCloseDate = agHelper.dtDBNull(dr["JobClosureDate"]),
                            JobCloseTime = agHelper.dtDBNull(dr["JobClosureTime"]),
                            FuelLtrs = Convert.ToDecimal(dr["FuelLtrs"]),
                            CloseKMs = agHelper.dDBNull(dr["CloseKMs"]),
                            CashReturned = agHelper.dDBNull(dr["CashReturned"]),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            StateName = dr["StateName"].ToString(),
                            Outsourced = Convert.ToBoolean(dr["Outsourced"]),
                            HasGenset = Convert.ToBoolean(dr["HasGenset"]),
                            GensetFuelLtrs = agHelper.dDBNull(dr["GensetFuelLtrs"]),
                            GensetCashReturned = agHelper.dDBNull(dr["GensetCashReturned"]),
                            VehicleFuel = JobFuel.GetForVehicle(Convert.ToInt32(dr["JobId"])),
                            GenSetFuel = JobFuel.GetForGenset(Convert.ToInt32(dr["JobId"])),
                            Footer = new agFooter(dr),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Job jo, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveJob"))
                {
                    db.AddInParameter(dbCommand, "JobId", SqlDbType.Int, jo.JobId);
                    db.AddInParameter(dbCommand, "JobDate", SqlDbType.DateTime, jo.JobDate);
                    db.AddInParameter(dbCommand, "Advance", SqlDbType.Decimal, jo.Advance);
                    db.AddInParameter(dbCommand, "JobStartDate", SqlDbType.DateTime, jo.JobStartDate);  
                    db.AddInParameter(dbCommand, "JobStartTime", SqlDbType.DateTime, jo.JobStartTime);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, jo.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newJobNo", SqlDbType.VarChar, 32);                   
                    db.ExecuteNonQuery(dbCommand);
                    jo.JobNo = dbCommand.Parameters["@newJobNo"].Value.ToString();
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Close(Job jo, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("CloseJob"))
                    {
                        db.AddInParameter(dbCommand, "JobId", SqlDbType.Int, jo.JobId);
                        db.AddInParameter(dbCommand, "JobCloseDate", SqlDbType.DateTime, jo.JobCloseDate);
                        db.AddInParameter(dbCommand, "JobCloseTime", SqlDbType.DateTime, jo.JobCloseTime);
                        db.AddInParameter(dbCommand, "CloseKMs", SqlDbType.Decimal, jo.CloseKMs);
                        db.AddInParameter(dbCommand, "FuelLtrs", SqlDbType.Decimal, jo.FuelLtrs);
                        db.AddInParameter(dbCommand, "CashReturned", SqlDbType.Decimal, jo.CashReturned);
                        db.AddInParameter(dbCommand, "Outsourced", SqlDbType.Bit, jo.Outsourced);
                        db.AddInParameter(dbCommand, "HasGenset", SqlDbType.Bit, jo.HasGenset);
                        db.AddInParameter(dbCommand, "GensetCashReturned", SqlDbType.Decimal, jo.GensetCashReturned);
                        db.AddInParameter(dbCommand, "GensetFuelLtrs", SqlDbType.Decimal, jo.GensetFuelLtrs);
                        db.AddInParameter(dbCommand, "StateId", SqlDbType.SmallInt, jo.StateId);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, jo.Footer.UpdatedOn);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        JobFuel.SaveForVehicle(jo.JobId.Value, jo.VehicleFuel, userId, transaction);
                        JobFuel.SaveForGenset(jo.JobId.Value, jo.GenSetFuel, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception) { transaction.Rollback(); throw; }
            }
        }

        internal static bool ReOpen(string jobNo, string reason, string userId, short companyId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("ReOpenJob"))
                {
                    db.AddInParameter(dbCommand, "JobNo", SqlDbType.VarChar, jobNo);
                    db.AddInParameter(dbCommand, "Reason", SqlDbType.VarChar, reason);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
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