using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Detention : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? DetentionId { get; set; }
        public string DetentionName { get; set; }
        public short? HRsThreshold { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Detention()
        {
        }
        #endregion

        #region internal methods
        internal static Detention Get(short detId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDetentionById"))
            {
                db.AddInParameter(dbCommand, "DetentionId", SqlDbType.Int, detId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Detention
                        {
                            DetentionId = Convert.ToInt16(dr["DetentionId"]),
                            DetentionName = dr["DetentionName"].ToString(),
                            HRsThreshold = Convert.ToInt16(dr["HRsThreshold"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Detention d, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDetention"))
                {
                    db.AddInParameter(dbCommand, "DetentionId", SqlDbType.Int, d.DetentionId);
                    db.AddInParameter(dbCommand, "DetentionName", SqlDbType.VarChar, d.DetentionName);
                    db.AddInParameter(dbCommand, "HRsThreshold", SqlDbType.SmallInt, d.HRsThreshold);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, d.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, d.Footer.UpdatedOn);
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