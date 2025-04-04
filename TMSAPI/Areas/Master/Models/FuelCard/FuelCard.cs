using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class FuelCard : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? CardId { get; set; }
        public string CardNo { get; set; }
        public double CardLimit { get; set; }
        public short? ClientId { get; set; }
        public short? SupplierId { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; }
        #endregion

        #region constructor
        public FuelCard()
        {
            Footer = new agFooter();
        }
        #endregion

        #region internal methods
        internal static FuelCard Get(short cardId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelCardById"))
            {
             //   db.AddInParameter(dbCommand, "UserId", SqlDbType.SmallInt, userId);
                db.AddInParameter(dbCommand, "CardId", SqlDbType.SmallInt, cardId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new FuelCard
                        {
                            CardId = Convert.ToInt16(dr["CardId"]),
                            CardNo = dr["CardNo"].ToString(),
                            CardLimit = Convert.ToDouble(dr["FuelCardLimit"]),
                            ClientId = agHelper.sDBNull(dr["ClientId"]),
                            SupplierId = agHelper.sDBNull(dr["SupplierId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(FuelCard fc, string userId, short companyId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFuelCard"))
                {
                    db.AddInParameter(dbCommand, "CardId", SqlDbType.SmallInt, fc.CardId);
                    db.AddInParameter(dbCommand, "CardNo", SqlDbType.VarChar, fc.CardNo);
                    db.AddInParameter(dbCommand, "CardLimit", SqlDbType.VarChar, fc.CardLimit);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.VarChar, fc.ClientId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, fc.SupplierId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, fc.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, fc.Footer.UpdatedOn);
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