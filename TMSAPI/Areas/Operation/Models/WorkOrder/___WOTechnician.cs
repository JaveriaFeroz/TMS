using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Operation.Models
{
    public class ___WOTechnician
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? TechId { get; set; }
        public short TechnicianId { get; set; }
        public double NormalHrs { get; set; }
        public double OverTimeHrs { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region constructor
        public ___WOTechnician()
        {
            TechId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public ___WOTechnician(int techId, short technicianid, double normalHrs,
            double overtimeHour)
        {
            TechId = techId;
            TechnicianId = technicianid;
            NormalHrs = normalHrs;
            OverTimeHrs = overtimeHour;
            Add = false; Edit = false; Delete = false;
        }
        #endregion

        #region internal methods
        internal static List<___WOTechnician> Get(int _woNo)
        {
            List<___WOTechnician> lstAM = new List<___WOTechnician>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getWOActualManPowerByNo"))
            {
                db.AddInParameter(dbCommand, "WorkOrderNo", SqlDbType.VarChar, _woNo);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAM.Add(new ___WOTechnician(
                                Convert.ToInt32(dr["ManPowerId"]),
                                Convert.ToInt16(dr["TechnicianId"]),
                                        Convert.ToDouble(dr["NormalHrsConsumed"]),
                                    Convert.ToDouble(dr["OvertimeHrsConsumed"])));
                        }
                    }
                }
            }
            return lstAM;
        }

        internal static bool SaveDetail(int? workOrderNo, List<___WOTechnician> actualManPower, string userId, DbTransaction transaction)
        {
            foreach (___WOTechnician manPower in getWorkOrderMPChanges(actualManPower))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWorkOrderActualManPower"))
                {
                    db.AddInParameter(dbCommand, "ManPowerId", SqlDbType.Int, manPower.TechId);
                    db.AddInParameter(dbCommand, "WONo", SqlDbType.Int, workOrderNo);
                    db.AddInParameter(dbCommand, "TechnicianId", SqlDbType.SmallInt, manPower.TechnicianId);
                    db.AddInParameter(dbCommand, "NormalHrsConsumed", SqlDbType.Float, manPower.NormalHrs);
                    db.AddInParameter(dbCommand, "OvertimeHrsConsumed", SqlDbType.Float, manPower.OverTimeHrs);

                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          manPower.Delete ? "D" : (manPower.Add ? "I" : "U")));
                    db.AddOutParameter(dbCommand, "newManPowerId", SqlDbType.Int, 32);

                    db.ExecuteNonQuery(dbCommand, transaction);

                    manPower.TechId = Convert.ToInt32(dbCommand.Parameters["@newManPowerId"].Value);
                }
            }
            return true;
        }
        #endregion

        #region private methods
        private static IEnumerable<___WOTechnician> getWorkOrderMPChanges(List<___WOTechnician> actualManPower)
        {
            return (actualManPower.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}
