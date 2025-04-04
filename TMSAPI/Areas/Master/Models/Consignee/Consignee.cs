using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Consignee : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ConsigneeId { get; set; }
        public string ConsigneeName { get; set; }
        public short? CityId { get; set; }
        public short? ClientId { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructors
        public Consignee()
		{
        }
        #endregion

        #region internal methods
        internal static Consignee Get(int consigneeId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetConsigneeById"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.Int, consigneeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Consignee
                        {
                            ConsigneeId = Convert.ToInt32(dr["ConsigneeId"]),
                            ConsigneeName = dr["ConsigneeName"].ToString(),
                            Address = dr["ConsigneeAddress"].ToString(),
                            CityId = Convert.ToInt16(dr["CityId"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            ContactNo = dr["ContactNo"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Consignee _cn, short companyId, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveConsignee"))
                {
                    db.AddInParameter(dbCommand, "ConsigneeId", SqlDbType.Int, _cn.ConsigneeId);
                    db.AddInParameter(dbCommand, "ConsigneeName", SqlDbType.VarChar, _cn.ConsigneeName);
                    db.AddInParameter(dbCommand, "ConsigneeAddress", SqlDbType.VarChar, _cn.Address);
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, _cn.CityId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _cn.ClientId);
                    db.AddInParameter(dbCommand, "ContactNo", SqlDbType.VarChar, _cn.ContactNo);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, _cn.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _cn.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region disposable method
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}