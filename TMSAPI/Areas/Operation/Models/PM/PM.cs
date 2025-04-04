using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class PM : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? PMId { get; set; }
        public short CapacityId { get; set; }
        public short AssetMakeId { get; set; }
        public short ActivityId { get; set; }
	    public int DueKMs { get; set; }
        public int AlertKMs { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public PM()
        {
        }
        #endregion

        #region internal methods
        internal static PM Get(short pmId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPMById"))
            {
                db.AddInParameter(dbCommand, "PMId", SqlDbType.Int, pmId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new PM
                        {
                            PMId = pmId,
                            CapacityId = Convert.ToInt16(dr["CapacityId"]),
                            AssetMakeId = Convert.ToInt16(dr["MakeId"]),
                            ActivityId = Convert.ToInt16(dr["ActivityId"]),
                            DueKMs = Convert.ToInt32(dr["DueKMs"]),
                            AlertKMs = Convert.ToInt32(dr["AlertKMs"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(PM pm, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SavePM"))
                {
                    db.AddInParameter(dbCommand, "PMId", SqlDbType.SmallInt, pm.PMId);
                    db.AddInParameter(dbCommand, "CapacityId", SqlDbType.SmallInt, pm.CapacityId);
                    db.AddInParameter(dbCommand, "MakeId", SqlDbType.SmallInt, pm.AssetMakeId);
                    db.AddInParameter(dbCommand, "ActivityId", SqlDbType.SmallInt, pm.ActivityId);
                    db.AddInParameter(dbCommand, "DueKms", SqlDbType.Int, pm.DueKMs);
                    db.AddInParameter(dbCommand, "Alertkms", SqlDbType.Int, pm.AlertKMs);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, pm.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, pm.Footer.UpdatedOn);
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