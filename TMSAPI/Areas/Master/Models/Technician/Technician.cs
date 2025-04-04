using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Technician : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TechnicianId {get;set;}
        public string TechnicianName {get;set;}
        public short TypeId { get; set; }
        public double Rate {get;set;}
        public double OTRate {get;set;}
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor     
        public Technician()
        {
        }
        #endregion

        #region internal methods
        internal static Technician Get(short techId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetTechnicianById"))
            {
                db.AddInParameter(dbCommand, "TechnicianId", SqlDbType.SmallInt, techId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Technician
                        {
                            TechnicianId = techId,
                            TechnicianName = dr["TechnicianName"].ToString(),
                            TypeId = Convert.ToInt16(dr["TechnicianTypeId"]),
                            Rate = Convert.ToDouble(dr["Rate"]),
                            OTRate = Convert.ToDouble(dr["OTRate"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Technician tn, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveTechnician"))
                {
                    db.AddInParameter(dbCommand, "TechnicianId", SqlDbType.SmallInt, tn.TechnicianId);
                    db.AddInParameter(dbCommand, "TechnicianName", SqlDbType.VarChar, tn.TechnicianName);
                    db.AddInParameter(dbCommand, "TechnicianTypeId", SqlDbType.TinyInt, tn.TypeId);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, tn.Rate);
                    db.AddInParameter(dbCommand, "OTRate", SqlDbType.Float, tn.OTRate);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, tn.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, tn.Footer.UpdatedOn);
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