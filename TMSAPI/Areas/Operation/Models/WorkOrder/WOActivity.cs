using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class WOActivity
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ActivityId { get; set; }
        public string ActivityName { get; set; }
        public bool Selected { get; set; }
        #endregion

        #region constructor
        public WOActivity()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOActivity> Get(int woId)
        {
            try
            {
                List<WOActivity> activities = new List<WOActivity>();
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetWOActivitiesById"))
                {
                    db.AddInParameter(dbCommandDetail, "WOId", SqlDbType.Int, woId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                activities.Add(new WOActivity
                                {
                                    DetailId = agHelper.iDBNull(dr["DetailId"]),
                                    ActivityId = Convert.ToInt16(dr["ActivityId"]),
                                    ActivityName = dr["ActivityName"].ToString(),
                                    Selected = Convert.ToBoolean(dr["Selected"])
                                });
                            }
                        }
                    }
                }
                return activities;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int? woId, List<WOActivity> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WOActivity wa in (details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWOActivity"))
                    {
                        db.AddInParameter(dbCommand, "WOId", SqlDbType.Int, woId);
                        db.AddInParameter(dbCommand, "ActivityId", SqlDbType.Int, wa.DetailId);
                        db.AddInParameter(dbCommand, "ActivityTypeId", SqlDbType.SmallInt, wa.ActivityId);
                        db.AddInParameter(dbCommand, "Selected", SqlDbType.Bit, wa.Selected);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
            }
            catch (Exception) { throw; }
            return true;
        }
        #endregion
    }
}