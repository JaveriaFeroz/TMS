using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    public class RateTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public RateTypes()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateTypes> Get(bool _activeOnly = true)
        {
            try
            {
                List<RateTypes> ratetypes = new List<RateTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateTypes"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                ratetypes.Add(new RateTypes
                                {
                                    TypeId = Convert.ToInt16(dr["TypeId"]),
                                    TypeName = dr["TypeName"].ToString(),
                                    IsActive = Convert.ToBoolean(dr["IsActive"])
                                });
                            }
                        }
                    }
                }
                return ratetypes;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}
