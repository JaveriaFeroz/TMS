using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class SupplierTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0, Name ="Type Id")]
        public short TypeId { get; set; }
        [DataMember(Order = 1, Name ="Type Desc")]
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public SupplierTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<SupplierTypes> Get(bool _activeOnly = true)
        {
            List<SupplierTypes> lstST = new List<SupplierTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSupplierTypes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstST.Add(new SupplierTypes
                            {
                                TypeId = Convert.ToInt16(dr["SupplierTypeId"]),
                                TypeName = dr["SupplierTypeName"].ToString()
                            });
                        }
                    }
                }
            }
            return lstST;
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