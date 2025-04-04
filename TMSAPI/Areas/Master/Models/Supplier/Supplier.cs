using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Supplier : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SupplierId { get; set; }
        public short SupplierTypeId { get; set; }
        public string SupplierName { get; set; }
        public double SCRate { get; set; }
        public string Address { get; set; }
        public short? CityId { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string FaxNo { get; set; }
        public string ContactName { get; set; }
        public string MobileNo { get; set; }
        public string NTN { get; set; }
        public string URL { get; set; }
        public string ControlSupplierId { get; set; }
        public bool IsActive { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Supplier()
        {
        }
        #endregion

        #region internal methods
        internal static Supplier Get(short supplierId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSupplierById"))
            {
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Supplier
                        {
                            SupplierId = supplierId,
                            SupplierTypeId = Convert.ToInt16(dr["SupplierTypeId"]),
                            SupplierName = dr["SupplierName"].ToString(),
                            SCRate = Convert.ToDouble(dr["SCRate"]),
                            Address = dr["Address"].ToString(),
                            CityId = agHelper.sDBNull(dr["CityId"]),
                            Email = dr["Email"].ToString(),
                            PhoneNo = dr["PhoneNo"].ToString(),
                            MobileNo = dr["MobileNo"].ToString(),
                            FaxNo = dr["FaxNo"].ToString(),
                            NTN = dr["NTN"].ToString(),
                            URL = dr["URL"].ToString(),
                            ContactName = dr["ContactName"].ToString(),
                            ControlSupplierId = dr["ControlSupplierId"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Supplier supp, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSupplier"))
            {
                try
                {
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supp.SupplierId);
                    db.AddInParameter(dbCommand, "SupplierName", SqlDbType.VarChar, supp.SupplierName);
                    db.AddInParameter(dbCommand, "SupplierTypeId", SqlDbType.SmallInt, supp.SupplierTypeId);
                    db.AddInParameter(dbCommand, "Address", SqlDbType.VarChar, supp.Address);
                    db.AddInParameter(dbCommand, "SCRate", SqlDbType.Decimal, supp.SCRate);
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, supp.CityId);
                    db.AddInParameter(dbCommand, "PhoneNo", SqlDbType.VarChar, supp.PhoneNo);
                    db.AddInParameter(dbCommand, "MobileNo", SqlDbType.VarChar, supp.MobileNo);
                    db.AddInParameter(dbCommand, "FaxNo", SqlDbType.VarChar, supp.FaxNo);
                    db.AddInParameter(dbCommand, "NTN", SqlDbType.VarChar, supp.NTN);
                    db.AddInParameter(dbCommand, "URL", SqlDbType.VarChar, supp.URL);
                    db.AddInParameter(dbCommand, "ContactName", SqlDbType.VarChar, supp.ContactName);
                    db.AddInParameter(dbCommand, "ControlSupplierId", SqlDbType.VarChar, supp.ControlSupplierId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, supp.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, supp.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
                catch (Exception ex) { throw ex; }
            }
        }
        #endregion

        #region idisposal
        public void Dispose()
        {
        }
        #endregion
    }
}