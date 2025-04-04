using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Complainant : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ComplainantId { get; set; }
        public string ComplainantName { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Complainant()
        {
        }
        #endregion

        #region internal methods
        internal static Complainant Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetComplainantById"))
            {
                db.AddInParameter(dbCommand, "ComplainantId", SqlDbType.SmallInt, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Complainant
                        {
                            ComplainantId = Convert.ToInt16(dr["ComplainantId"]),
                            ComplainantName = dr["ComplainantName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Complainant c, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveComplainant"))
                {
                    db.AddInParameter(dbCommand, "ComplainantId", SqlDbType.SmallInt, c.ComplainantId);
                    db.AddInParameter(dbCommand, "ComplainantName", SqlDbType.VarChar, c.ComplainantName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, c.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
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