using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class WarningType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public WarningType()
        {
        }
        #endregion

        #region internal methods
        internal static WarningType Get(short _typeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWarningTypeById"))
            {
                db.AddInParameter(dbCommand, "Typeid", SqlDbType.Int, _typeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new WarningType
                        {
                            TypeId = Convert.ToInt16(dr["TypeId"]),
                            TypeName = dr["TypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WarningType wt, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWarningType"))
                {
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, wt.TypeId);
                    db.AddInParameter(dbCommand, "TypeName", SqlDbType.VarChar, wt.TypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, wt.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, wt.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
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