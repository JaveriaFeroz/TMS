using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class Priorities
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short PriorityId { get; set; }
        public string PriorityName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Priorities()
        {
        }
        #endregion

        #region internal methods
        internal static List<Priorities> Get(bool _activeOnly = true)
        {
            try
            {
                List<Priorities> priorities = new List<Priorities>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetPriorities"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                priorities.Add(new Priorities
                                {
                                    PriorityId = Convert.ToInt16(dr["PriorityId"]),
                                    PriorityName = dr["PriorityName"].ToString(),
                                    IsActive = Convert.ToBoolean(dr["IsActive"])
                                });
                            }
                        }
                    }
                }
                return priorities;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}