using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class _____WOEstTechnician
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? TypeId { get; set; }
        public double WorkingHrs { get; set; }
        public double OverTimeHrs { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public _____WOEstTechnician()
        {
        }
        #endregion

        #region internal methods
        internal static List<_____WOEstTechnician> Get(int woId)
        {
            List<_____WOEstTechnician> technicians = new List<_____WOEstTechnician>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOEstTechniciansById"))
            {
                db.AddInParameter(dbCommand, "WOId", SqlDbType.VarChar, woId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            technicians.Add(new _____WOEstTechnician
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                WorkingHrs = Convert.ToDouble(dr["WorkingHrs"]),
                                OverTimeHrs = Convert.ToDouble(dr["OverTimeHrs"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return technicians;
        }

        internal static bool Save(int woId, List<_____WOEstTechnician> details, string userId, DbTransaction transaction)
        {
            foreach (_____WOEstTechnician woet in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOEstTechnician"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, woet.DetailId);
                    db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.Int, woet.TypeId);
                    db.AddInParameter(dbCommand, "WorkingHrs", SqlDbType.Float, woet.WorkingHrs);
                    db.AddInParameter(dbCommand, "OverTimeHrs", SqlDbType.Float, woet.OverTimeHrs);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                             woet.Delete ? "D" : (woet.Add ? "I" : "U")));
                    db.AddOutParameter(dbCommand, "newDetailId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    woet.DetailId = Convert.ToInt32(dbCommand.Parameters["@newDetailId"].Value);
                }
            }
            return true;
        }
        #endregion
    }
}