using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class DriverTraining
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? TrainingId { get; set; }
        public short? TrainerId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public DriverTraining()
        {
        }
        #endregion

        #region internal methods
        internal static List<DriverTraining> Get(int productid)
        {
            List<DriverTraining> trainings = new List<DriverTraining>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverTrainingsById"))
            {
                db.AddInParameter(dbCommand, "DriverId", SqlDbType.SmallInt, productid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            trainings.Add(new DriverTraining
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                TrainingId = Convert.ToInt16(dr["TrainingId"]),
                                TrainerId = Convert.ToInt16(dr["TrainerId"]),
                                StartDate = agHelper.dtDBNull(dr["StartDate"]),
                                EndDate = agHelper.dtDBNull(dr["EndDate"]),
                                DueDate = agHelper.dtDBNull(dr["DueDate"]),                                
                                Add = false
                            });
                        }
                    }
                }
            }
            return trainings;
        }

        internal static bool Save(int? driverid, List<DriverTraining> details, string userId, DbTransaction transaction)
        {
            foreach (DriverTraining dt in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriverTraining"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, dt.DetailId);
                    db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverid);
                    db.AddInParameter(dbCommand, "TrainingId", SqlDbType.VarChar, dt.TrainingId);
                    db.AddInParameter(dbCommand, "TrainerId", SqlDbType.VarChar, dt.TrainerId);
                    db.AddInParameter(dbCommand, "StartDate", SqlDbType.DateTime, dt.StartDate); 
                    db.AddInParameter(dbCommand, "EndDate", SqlDbType.DateTime, dt.EndDate); 
                    db.AddInParameter(dbCommand, "DueDate", SqlDbType.DateTime, dt.DueDate);  
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               dt.Delete ? "D" : (dt.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
