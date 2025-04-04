using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class AccountTypes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [Browsable(false)]
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public AccountTypes()
        {
        }
        #endregion

        #region public functions
        internal static List<AccountTypes> Get(bool activeOnly = true )
        {
            List<AccountTypes> types = new List<AccountTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccountTypes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new AccountTypes
                            {
                                TypeId = Convert.ToInt16(dr["AccountTypeId"]),
                                TypeName = dr["AccountTypeName"].ToString(),
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
