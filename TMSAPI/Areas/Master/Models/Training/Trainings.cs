using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class Trainings
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TrainingId { get; set; }
        [DataMember(Order = 1)]       
        public string TrainingName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Trainings()
        {
        }
        #endregion

        #region internal methods
        internal static List<Trainings> Get()
        {
            List<Trainings> trainings = new List<Trainings>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTrainings"))
            {                
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            trainings.Add(new Trainings
                            {
                                TrainingId = Convert.ToInt16(dr["TrainingId"]),
                                TrainingName = dr["TrainingName"].ToString()
                            });
                        }
                    }
                }
            }
            return trainings;
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
