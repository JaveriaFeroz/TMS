using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class SupplierRateDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public double FuelRate { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public SupplierRateDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<SupplierRateDetail> Get(short _supplierid)
        {
            List<SupplierRateDetail> details = new List<SupplierRateDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSupplierFuelRate"))
            {
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, _supplierid) ;
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new SupplierRateDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FromDate = Convert.ToDateTime(dr["FromDate"]),
                                ToDate = Convert.ToDateTime(dr["ToDate"]),
                                FuelRate = Convert.ToDouble(dr["FuelRate"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(short? _supplierid, List<SupplierRateDetail> _details, string _userId, DbTransaction _transaction)
        {
            try
            {
                foreach (SupplierRateDetail _srd in agHelper.GetChanges(_details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSupplierFuelRate"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.VarChar, _srd.DetailId);
                        db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, _supplierid);
                        db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, _srd.FromDate); 
                        db.AddInParameter(dbCommand, "ToDate", SqlDbType.DateTime, _srd.ToDate); 
                        db.AddInParameter(dbCommand, "FuelRate", SqlDbType.Float, _srd.FuelRate);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                           _srd.Delete ? "D" : (_srd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, _transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }
        #endregion
    }
}