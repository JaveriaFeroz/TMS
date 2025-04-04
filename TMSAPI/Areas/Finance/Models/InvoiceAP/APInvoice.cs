using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class APInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? PIVId { get; set; }
        public string PIVNo { get; set; }
        public DateTime? PIVDate { get; set; }
        public short? SupplierId { get; set; }
        public string SupplierInvNo { get; set; }
        public DateTime? SupplierInvDate { get; set; }
        public double Amount { get; set; }
        public string Narration { get; set; }
        public short? PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ReversedPIVNo { get; set; }
        public string SourcePIVNo { get; set; }
        public bool HasSlip { get; set; } = false;
        public DateTime? SlipDateFrom { get; set; }
        public DateTime? SlipDateTo { get; set; }
        public List<APInvoiceDetail> Details { get; set; } = new List<APInvoiceDetail>();
        public List<APInvoiceSlip> Slips { get; set; } = new List<APInvoiceSlip>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public APInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static APInvoice Get(string pivNo, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetAPInvoiceByNo"))
                {
                    db.AddInParameter(dbCommand, "PIVNo", SqlDbType.VarChar, pivNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new APInvoice
                            {
                                PIVId = Convert.ToInt32(dr["PIVId"]),
                                PIVNo = pivNo,
                                PIVDate = Convert.ToDateTime(dr["PIVDate"]),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                SupplierInvNo = dr["SupplierInvNo"].ToString(),
                                SupplierInvDate = Convert.ToDateTime(dr["SupplierInvDate"]),
                                Amount = Convert.ToDouble(dr["Amount"]),
                                Narration = dr["Narration"].ToString(),
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName= dr["PeriodName"].ToString(),
                                ReversedPIVNo = dr["ReversedPIVNo"].ToString(),
                                SourcePIVNo = dr["SourcePIVNo"].ToString(),
                                HasSlip = Convert.ToBoolean(dr["HasSlip"]),
                                SlipDateFrom = agHelper.dtDBNull(dr["SlipDateFrom"]),
                                SlipDateTo = agHelper.dtDBNull(dr["SlipDateTo"]),
                                Footer = new agFooter(dr),
                                Details = APInvoiceDetail.Get(Convert.ToInt32(dr["PIVId"])),
                                Slips = APInvoiceSlip.Get(Convert.ToInt32(dr["PIVId"]))
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(APInvoice piv, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAPInvoice"))
                {
                    db.AddInParameter(dbCommand, "PIVDate", SqlDbType.DateTime, piv.PIVDate);
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, piv.SupplierId);
                    db.AddInParameter(dbCommand, "SupplierInvNo", SqlDbType.VarChar, piv.SupplierInvNo);
                    db.AddInParameter(dbCommand, "SupplierInvDate", SqlDbType.DateTime, piv.SupplierInvDate);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.VarChar, piv.Amount);
                    db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, piv.Narration);
                    db.AddInParameter(dbCommand, "HasSlip", SqlDbType.Bit, piv.HasSlip);
                    db.AddInParameter(dbCommand, "SlipDateFrom", SqlDbType.DateTime, piv.SlipDateFrom);
                    db.AddInParameter(dbCommand, "SlipDateTo", SqlDbType.DateTime, piv.SlipDateTo);
                    db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, piv.PeriodId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newPIVNo", SqlDbType.VarChar, 10);
                    db.AddOutParameter(dbCommand, "NewId", SqlDbType.VarChar, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    piv.PIVNo = dbCommand.Parameters["@NewPIVNo"].Value.ToString();
                    piv.PIVId = Convert.ToInt32(dbCommand.Parameters["@NewId"].Value);
                    APInvoiceDetail.Save(piv.PIVId.Value, piv.Details, userId, transaction);
                    if (piv.HasSlip)
                        APInvoiceSlip.Save(piv.PIVId.Value, piv.Slips, userId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }

        internal static bool Reverse(string pivNo, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("ReverseAPInvoice");
                db.AddInParameter(dbCommandDetail, "PIVNo", SqlDbType.VarChar, pivNo);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommandDetail);
            }
            catch (Exception ex) { throw ex; }
            return true;
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