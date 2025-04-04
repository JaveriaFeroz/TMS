using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Inventory.Models
{
    public class ReceiptTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public ReceiptTypes()
        {
        }
        #endregion

        #region internal methods
        internal static List<ReceiptTypes> Get(bool _activeOnly = true )
        {
            List<ReceiptTypes> grntypes = new List<ReceiptTypes>();

            DbCommand dbCommand = db.GetStoredProcCommand("GetGRNTypes");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        grntypes.Add(new ReceiptTypes
                        {
                            TypeId = Convert.ToInt16(dr["TypeId"]),
                            TypeName = dr["TypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return grntypes;
        }
        #endregion
    }
}

