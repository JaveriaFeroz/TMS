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
    public class Trainers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TrainerId { get; set; }
        [DataMember(Order = 1)]       
        public string TrainerName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Trainers()
        {
        }
        #endregion

        #region internal methods
        internal static List<Trainers> Get()
        {
            List<Trainers> trainers = new List<Trainers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTrainers"))
            {                
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            trainers.Add(new Trainers
                            {
                                TrainerId = Convert.ToInt16(dr["TrainerId"]),
                                TrainerName = dr["TrainerName"].ToString()
                            });
                        }
                    }
                }
            }
            return trainers;
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
