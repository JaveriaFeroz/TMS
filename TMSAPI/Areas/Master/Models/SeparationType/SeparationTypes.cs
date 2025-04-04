using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class SeparationTypes
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
        public SeparationTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<SeparationTypes> Get(bool _activeOnly = true)
        {
            List<SeparationTypes> types = new List<SeparationTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSeparationTypes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new SeparationTypes
                            {
                                TypeId = Convert.ToInt16(dr["SeparationTypeId"]),
                                TypeName = dr["SeparationTypeName"].ToString()
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