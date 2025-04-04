using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    public class Activities
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ActivityId { get; set; }
        public string ActivityName { get; set; }
        public double EstHrsReq { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Activities()
        {
        }
        #endregion

        #region internal methods
        internal static List<Activities> Get(bool _activeOnly = true)
        {
            List<Activities> activities = new List<Activities>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetActivities"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            activities.Add(new Activities
                            {
                                ActivityId = Convert.ToInt16(dr["ActivityId"]),
                                ActivityName = dr["ActivityName"].ToString(),
                                EstHrsReq = Convert.ToDouble(dr["EstHrsReq"]),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return activities;
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
