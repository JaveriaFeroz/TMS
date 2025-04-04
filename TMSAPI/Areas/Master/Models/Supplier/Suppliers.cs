using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Suppliers
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short? SupplierId { get; set; }
        [DataMember(Order = 1)]
        public string SupplierName { get; set; }
        [DataMember(Order = 2)]
        public string SupplierTypeName { get; set; }
        [DataMember(Order = 3)]
        public string CityName { get; set; }
        #endregion

        #region constructor
        public Suppliers()
        {
        }
        #endregion

        #region internal methods
        internal static List<Suppliers> Get(short companyId, bool _activeOnly = true)
        {
            List<Suppliers> suppliers = new List<Suppliers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSuppliers"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            suppliers.Add(new Suppliers
                            {
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                SupplierName = dr["SupplierName"].ToString(),
                                SupplierTypeName = dr["SupplierTypeName"].ToString(),
                                CityName = dr["CityName"].ToString()
                            });
                        }
                    }
                }
            }
            return suppliers;
        }

        internal static List<Suppliers> GetForFuel(short companyId, bool _activeOnly = true)
        {
            return get("GetFuelSuppliers", companyId, _activeOnly);
        }

        internal static List<Suppliers> GetForOutSourcedVehicle(short companyId, bool _activeOnly = true)
        {
            return get("GetOVSuppliers", companyId, _activeOnly);
        }
        #endregion

        #region private methods
        private static List<Suppliers> get(string _spName, short companyId, bool _activeOnly = true)
        {
            List<Suppliers> suppliers = new List<Suppliers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(_spName))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            suppliers.Add(new Suppliers
                            {
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                SupplierName = dr["SupplierName"].ToString()
                            });
                        }
                    }
                }
            }
            return suppliers;
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
