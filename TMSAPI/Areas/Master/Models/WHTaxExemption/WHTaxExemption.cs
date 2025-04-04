using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class WHTaxExemption : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ExemptionId {get; set;}
        public DateTime DateFrom { get; set;}
        public DateTime DateTo { get; set;}
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructors
        public WHTaxExemption()
        {
        }
        #endregion

        #region internal methods
        internal static WHTaxExemption Get(short id, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWHTaxExemptionById"))
            {
                db.AddInParameter(dbCommand, "ExemptionId", SqlDbType.SmallInt, id);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new WHTaxExemption
                        {
                            ExemptionId = id,
                            DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                            DateTo = Convert.ToDateTime(dr["DateTo"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WHTaxExemption wt, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWHTaxExemption"))
                {
                    db.AddInParameter(dbCommand, "ExemptionId", SqlDbType.Int, wt.ExemptionId);
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, wt.DateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, wt.DateTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
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
            //throw new Exception("The method or operation is not implemented.");
            
        }

        #endregion
    }
}