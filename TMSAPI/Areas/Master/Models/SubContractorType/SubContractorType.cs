using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SubContractorType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SCTypeId { get; set; }
        public string SCTypeName { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor     
        public SubContractorType()
        {
        }
        #endregion

        #region internal methods
        internal static SubContractorType Get(short scTypeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSubContractorTypeById"))
            {
                db.AddInParameter(dbCommand, "SubContractorTypeId", SqlDbType.TinyInt, scTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new SubContractorType
                        {
                            SCTypeId = scTypeId,
                            SCTypeName = dr["SCTypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(SubContractorType sct, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSubContractorType"))
                {
                    db.AddInParameter(dbCommand, "SCTypeId", SqlDbType.TinyInt, sct.SCTypeId);
                    db.AddInParameter(dbCommand, "SCTypeName", SqlDbType.VarChar, sct.SCTypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, sct.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, sct.Footer.UpdatedOn);
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