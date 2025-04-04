using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Finance.Models
{
    public class APInvoiceSlip
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        public int? SlipId { get; set; }
        public string SlipNo { get; set; }
        public string SlipDate { get; set; }
        public double Qty { get; set; }
        public double Amount { get; set; }
        public bool Selected { get; set; }
        #endregion

        #region constructor
        public APInvoiceSlip()
        {
        }
        #endregion

        #region internal methods
        internal static List<APInvoiceSlip> Get(int pivId)
        {
            List<APInvoiceSlip> slips = new List<APInvoiceSlip>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAPInvoiceSlipById"))
            {
                db.AddInParameter(dbCommand, "PIVId", SqlDbType.Int, pivId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            slips.Add(new APInvoiceSlip
                            {
                                SlipId = Convert.ToInt32(dr["SlipId"]),
                                SlipNo = dr["SlipNo"].ToString(),
                                SlipDate = dr["SlipDate"].ToString(),
                                Qty = Convert.ToDouble(dr["Qty"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Selected = Convert.ToBoolean(dr["Selected"])
                            });
                        }
                    }
                }
            }
            return slips;
        }

        internal static List<APInvoiceSlip> GetOutstandingSlips(short supplierId, DateTime dateFrom, DateTime dateTo, short companyId)
        {
            List<APInvoiceSlip> slips = new List<APInvoiceSlip>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetOutstandingSlips"))
            {
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            slips.Add(new APInvoiceSlip
                            {
                                SlipId = Convert.ToInt32(dr["SlipId"]),
                                SlipNo = dr["SlipNo"].ToString(),
                                SlipDate = dr["SlipDate"].ToString(),
                                Qty = Convert.ToDouble(dr["Qty"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Selected = Convert.ToBoolean(dr["Selected"])
                            });
                        }
                    }
                }
            }
            return slips;
        }

        internal static bool Save(int pivId, List<APInvoiceSlip> details, string userId, DbTransaction transaction)
        {
            foreach (APInvoiceSlip apis in details.Where(x => x.Selected))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAPInvoiceSlip"))
                {
                    db.AddInParameter(dbCommand, "PIVId", SqlDbType.Int, pivId);
                    db.AddInParameter(dbCommand, "SlipId", SqlDbType.SmallInt, apis.SlipId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}