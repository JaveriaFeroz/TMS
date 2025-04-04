using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Activity : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ActivityId { get; set; }
        public string ActivityName { get; set; }
        public double EstHrsReq { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Activity()
        {}
        #endregion

        #region internal methods
        internal static Activity Get(short activityId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetActivityById"))
            {
                db.AddInParameter(dbCommand, "ActivityId", SqlDbType.SmallInt, activityId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Activity
                        {
                            ActivityId = Convert.ToInt16(dr["ActivityId"]),
                            ActivityName = dr["ActivityName"].ToString(),
                            EstHrsReq = Convert.ToDouble(dr["EstHrsReq"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Activity activity, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveActivity"))
                {
                    db.AddInParameter(dbCommand, "ActivityId", SqlDbType.Int, activity.ActivityId);
                    db.AddInParameter(dbCommand, "ActivityName", SqlDbType.VarChar, activity.ActivityName);
                    db.AddInParameter(dbCommand, "EstHrsReq", SqlDbType.Float, activity.EstHrsReq);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, activity.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, activity.Footer.UpdatedOn);
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