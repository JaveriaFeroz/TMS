using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class Company : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string NTN { get; set; }        
        public string PeriodName { get; set; }
        public short? DistanceThreshold { get; set; }
        public short? ReportGraceHRs { get; set; }
        public short? BankAccountId { get; set; }
        public short? ARPeriodId { get; set; }
        public short? ARAccountId { get; set; }
        public short? APPeriodId { get; set; }
        public short? APAccountId { get; set; }
        public short? GLPeriodId {get;set;}
        public short? OpsPeriodId { get; set; }
        public short? TripRevenueAccountId { get; set; }
        public short? FuelExpenseAccountId { get; set; }
        public short? AdvanceAccountId { get; set; }
        public bool EnableGL { get; set; }
        public bool EnablePartialDelivery { get; set; }
        public bool RouteByConsignee { get; set; }
        public bool SeparateFixedInvoice { get; set; }
        public bool IsMandatoryDriver2 { get; set; }
        public bool AllowTrailer { get; set; }

        #endregion

        #region constructor
        public Company()
        {
           
        }
        #endregion

        #region internal methods
        internal static Company Get(short companyId, bool _activeOnly = true)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetCompanyConfig"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new Company
                            {
                                CompanyId = Convert.ToInt16(dr["CompanyId"]),
                                CompanyName = dr["CompanyName"].ToString(),
                                CompanyAddress = dr["CompanyAddress"].ToString(),
                                NTN = dr["NTN"].ToString(),
                                PeriodName = dr["FinancialPeriod"].ToString(),
                                DistanceThreshold = Convert.ToInt16(dr["DistanceThreshold"]),
                                ReportGraceHRs = Convert.ToInt16(dr["ReportGraceHRs"]),
                                BankAccountId = agHelper.sDBNull(dr["BankAccountId"]),
                                TripRevenueAccountId = agHelper.sDBNull(dr["TripRevenueAccountId"]),
                                AdvanceAccountId = agHelper.sDBNull(dr["AdvanceAccountId"]),
                                ARPeriodId = agHelper.sDBNull(dr["ARPeriodId"]),
                                ARAccountId = agHelper.sDBNull(dr["ARAccountId"]),
                                APPeriodId = agHelper.sDBNull(dr["APPeriodId"]),
                                APAccountId = agHelper.sDBNull(dr["APAccountId"]),
                                GLPeriodId = agHelper.sDBNull(dr["GLPeriodId"]),
                                OpsPeriodId = agHelper.sDBNull(dr["OpsPeriodId"]),
                                FuelExpenseAccountId = agHelper.sDBNull(dr["FuelExpenseAccountId"]),
                                EnableGL = Convert.ToBoolean(dr["EnableGL"]),
                                EnablePartialDelivery = Convert.ToBoolean(dr["EnablePartialDelivery"]),
                                RouteByConsignee = Convert.ToBoolean(dr["RouteByConsignee"]),
                                SeparateFixedInvoice = Convert.ToBoolean(dr["SeparateFixedInvoice"]),
                                IsMandatoryDriver2 = Convert.ToBoolean(dr["IsMandatoryDriver2"]),
                                AllowTrailer = Convert.ToBoolean(dr["AllowTrailer"]),
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(Company _c, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCompany"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, _c.CompanyId);
                    db.AddInParameter(dbCommand, "CompanyName", SqlDbType.VarChar, _c.CompanyName);
                    db.AddInParameter(dbCommand, "CompanyAddress", SqlDbType.VarChar, _c.CompanyAddress);
                    db.AddInParameter(dbCommand, "NTN", SqlDbType.VarChar, _c.NTN);
                    db.AddInParameter(dbCommand, "DistanceThreshold", SqlDbType.Decimal, _c.DistanceThreshold);
                    db.AddInParameter(dbCommand, "HoursAllowedBeforeReport", SqlDbType.Decimal, _c.ReportGraceHRs);
                    db.AddInParameter(dbCommand, "EnableGL", SqlDbType.Bit, _c.EnableGL);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, _c.BankAccountId);
                    db.AddInParameter(dbCommand, "TripRevenueAccountId", SqlDbType.SmallInt, _c.TripRevenueAccountId);
                    db.AddInParameter(dbCommand, "AdvanceAccountId", SqlDbType.SmallInt, _c.AdvanceAccountId);
                    db.AddInParameter(dbCommand, "ARAccountId", SqlDbType.SmallInt, _c.ARAccountId);
                    db.AddInParameter(dbCommand, "APAccountId", SqlDbType.SmallInt, _c.APAccountId);
                    db.AddInParameter(dbCommand, "FuelExpenseAccountId", SqlDbType.SmallInt, _c.FuelExpenseAccountId);
                    db.AddInParameter(dbCommand, "RouteByConsignee", SqlDbType.Bit, _c.RouteByConsignee);
                    db.AddInParameter(dbCommand, "EnablePartialDelivery", SqlDbType.Bit, _c.EnablePartialDelivery);
                    db.AddInParameter(dbCommand, "SeparateFixedInvoice", SqlDbType.Bit, _c.SeparateFixedInvoice);
                    db.AddInParameter(dbCommand, "IsMandatoryDriver2", SqlDbType.Bit, _c.IsMandatoryDriver2);
                    db.AddInParameter(dbCommand, "AllowTrailer", SqlDbType.Bit, _c.AllowTrailer);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool SetUserDefaultCompany(short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SetUserDefaultCompany"))
            {
                try
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
                catch (Exception)
                { throw; }
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}