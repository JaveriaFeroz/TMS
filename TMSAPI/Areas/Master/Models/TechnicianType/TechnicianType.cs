using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class TechnicianType : IDisposable
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
        public TechnicianType()
        {
            
        }
        #endregion

        #region internal methods
        internal static TechnicianType Get(short _typeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTechnicianTypeById"))
            {
                db.AddInParameter(dbCommand, "TechnicianTypeId", SqlDbType.SmallInt, _typeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new TechnicianType
                        {
                            TypeId = _typeId,
                            TypeName = dr["TypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr["CreatedBy"].ToString(), dr["CreatedOn"], dr["UpdatedBy"].ToString(), dr["UpdatedOn"])
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(TechnicianType _tt, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveTechnicianType"))
                {
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, _tt.TypeId);
                    db.AddInParameter(dbCommand, "TypeName", SqlDbType.VarChar, _tt.TypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _tt.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _tt.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception) { throw; }
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
