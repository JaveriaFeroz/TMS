using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Operation.Models
{
    public class SVRStatus
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short StatusId { get; set; }
        public string StatusName { get; set; }
        #endregion

        #region constructor
        public SVRStatus()
        { }
        #endregion

        #region internal methods
        internal static List<SVRStatus> Get()
        {
            List<SVRStatus> statuses = new List<SVRStatus>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetServiceStatuses"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            statuses.Add(new SVRStatus
                            {
                                StatusId = Convert.ToInt16(dr["StatusId"]),
                                StatusName = dr["StatusName"].ToString()
                            });
                        }
                    }
                }
            }
            return statuses;
        }
        #endregion
    }
}