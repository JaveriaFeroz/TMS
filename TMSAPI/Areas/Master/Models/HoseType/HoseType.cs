using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class HoseType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? HoseTypeId { set; get; }
        public string HoseTypeName { set; get; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public HoseType()
        {
        }
        #endregion

        #region internal methods
        internal static HoseType Get(short _hoseTypeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetHoseTypeById"))
            {
                db.AddInParameter(dbCommand, "HoseTypeId", SqlDbType.SmallInt, _hoseTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new HoseType
                        {
                            HoseTypeId = Convert.ToInt16(dr["HoseTypeId"]),
                            HoseTypeName = dr["HoseTypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(HoseType _ht, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveHoseType"))
                {
                    db.AddInParameter(dbCommand, "HoseTypeId", SqlDbType.SmallInt, _ht.HoseTypeId);
                    db.AddInParameter(dbCommand, "HoseTypeName", SqlDbType.VarChar, _ht.HoseTypeName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _ht.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _ht.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Delete(short _hoseTypeId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("DeleteHoseType"))
                {
                    db.AddInParameter(dbCommand, "HoseTypeId", SqlDbType.SmallInt, _hoseTypeId);
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