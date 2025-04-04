using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class TechnicianTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0, Name ="Type Id")]
        public short TypeId { get; set; }
        [DataMember(Order = 1, Name ="Type Desc")]
        public string TypeName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public TechnicianTypes()
        {
        }
        #endregion

        #region internal methods
        internal static List<TechnicianTypes> Get(bool _activeOnly = true)
        {
            List<TechnicianTypes> types = new List<TechnicianTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTechnicianTypes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new TechnicianTypes
                            {
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return types;
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