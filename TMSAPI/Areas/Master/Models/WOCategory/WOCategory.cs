using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Common.Models
{
    [DataContract]
    public class WOType
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public WOType()
        {
        }
        #endregion

        #region internal methods
        internal static List<WOType> Get(short workFlowId)
        {
            List<WOType> types = new List<WOType>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWOTypes"))
            {
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, workFlowId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new WOType
                            {
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString()
                            });
                        }
                    }
                }
            }
            return types;
        }
        #endregion
    }
}
