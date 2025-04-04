using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class RequestType : IDisposable
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
        public RequestType()
        {
        }
        #endregion

        #region internal methods
        internal static RequestType Get(short typeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRequestTypeById"))
            {
                db.AddInParameter(dbCommand, "RequestTypeId", SqlDbType.SmallInt, typeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new RequestType
                        {
                            TypeId = Convert.ToInt16(dr["RequestTypeId"]),
                            TypeName = dr["RequestTypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(RequestType ct, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveRequestType"))
                {
                    db.AddInParameter(dbCommand, "RequestTypeId", SqlDbType.SmallInt, ct.TypeId);
                    db.AddInParameter(dbCommand, "RequestTypeName", SqlDbType.VarChar, ct.TypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, ct.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ct.Footer.UpdatedOn);
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