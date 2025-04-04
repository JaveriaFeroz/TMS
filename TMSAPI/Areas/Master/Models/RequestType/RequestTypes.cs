using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class RequestTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TypeId { get; set; }
        [DataMember(Order = 1)]
        public string TypeName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public RequestTypes()
        {
        }
        #endregion

        #region internal methods
        internal static List<RequestTypes> Get(bool _activeOnly=true)
        {
            try
            {
                List<RequestTypes> types = new List<RequestTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRequestTypes"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                types.Add(new RequestTypes
                                {
                                    TypeId = Convert.ToInt16(dr["RequestTypeId"]),
                                    TypeName = dr["RequestTypeName"].ToString(),
                                    IsActive = Convert.ToBoolean(dr["IsActive"])
                                });
                            }
                        }
                    }
                }
                return types;
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
