using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SubContractor : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SubContractorId { get; set; }
        public string SubContractorName { get; set; }
        public short SubContractorTypeId { get; set; }
        public double Rate { get; set; }
        public double OTRate { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public SubContractor()
        {
        }
        #endregion

        #region internal methods
        internal static SubContractor Get(short _scId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSubContractorById"))
            {
                db.AddInParameter(dbCommand, "SubContractorId", SqlDbType.SmallInt, _scId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new SubContractor
                        {
                            SubContractorId = Convert.ToInt16(dr["SubContractorId"]),
                            SubContractorName = dr["SubContractorName"].ToString(),
                            SubContractorTypeId = Convert.ToInt16(dr["SubContractorTypeId"]),
                            Rate = Convert.ToDouble(dr["NormalPerHrRate"]),
                            OTRate = Convert.ToDouble(dr["OvertimePerHrRate"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(SubContractor sc, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSubContractor"))
                {
                    db.AddInParameter(dbCommand, "SubContractorId", SqlDbType.Int, sc.SubContractorId);
                    db.AddInParameter(dbCommand, "SubContractorName", SqlDbType.VarChar, sc.SubContractorName);
                    db.AddInParameter(dbCommand, "SubContractorTypeId", SqlDbType.Int, sc.SubContractorTypeId);
                    db.AddInParameter(dbCommand, "NormalPerHrRate", SqlDbType.Float, sc.Rate);
                    db.AddInParameter(dbCommand, "OvertimePerHrRate", SqlDbType.Float, sc.OTRate);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, sc.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, sc.Footer.UpdatedOn);
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