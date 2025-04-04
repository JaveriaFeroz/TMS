using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Operation.Models
{
    public class CashFuel
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? SupplierId { get; set; }
        public string SlipNo { get; set; }
        public DateTime? SlipDate { get; set; }
        public double Litre { get; set; }
        public double Rate { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CashFuel()
        {
        }
        #endregion

        #region internal methods
        internal static List<CashFuel> Get(int rwbId, short companyId)
        {
            List<CashFuel> fuels = new List<CashFuel>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCashFuelById"))
            {
                db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            fuels.Add(new CashFuel
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                SlipNo = dr["SlipNo"].ToString(),
                                SlipDate = Convert.ToDateTime(dr["SlipDate"]),
                                Litre = Convert.ToDouble(dr["Litre"]),
                                Rate = Convert.ToDouble(dr["Rate"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return fuels;
        }
       
        internal static bool Save(int rwbId, List<CashFuel> details, short companyId, 
            string userId, DbTransaction transaction)
        {
            foreach (CashFuel cf in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCashFuel"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, cf.DetailId);
                    //db.AddInParameter(dbCommand, "JobId", SqlDbType.Int, jobId);
                    db.AddInParameter(dbCommand, "RwbId", SqlDbType.Int, rwbId);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, cf.SupplierId);
                    db.AddInParameter(dbCommand, "SlipNo", SqlDbType.VarChar, cf.SlipNo);
                    db.AddInParameter(dbCommand, "SlipDate", SqlDbType.DateTime, cf.SlipDate); 
                    db.AddInParameter(dbCommand, "Litre", SqlDbType.Decimal, cf.Litre);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, cf.Rate);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          cf.Delete ? "D" : (cf.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}