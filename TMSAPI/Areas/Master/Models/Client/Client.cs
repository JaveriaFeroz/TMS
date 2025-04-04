using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Client : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ClientId { get; set; }
        public short? AccountId { get; set; }
        public string ClientName { get; set; }
        public string ShortName { get; set; }
        public string Address { get; set; }
        public short? CityId { get; set; }
        public short? IndustryVerticalId { get; set; }
        //public string Terms { get; set; }
        public short? ContractPeriod { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public string URL { get; set; }
        public string ContactPerson { get; set; }
        public short? PaymentModeId { get; set; }
        public decimal CreditLimit { get; set; }
        public short? CreditDays { get; set; }
        //public decimal StandardLoadingTime { get; set; }
        public short? RateTypeId { get; set; }
        //public short DetGraceHRs { get; set; }
        //public short? InvoiceModeId { get; set; }
        //public decimal MaxInvAmount { get; set; }
        //public short? MaxShipment { get; set; }
        //public decimal WaiverTon { get; set; }
        //public bool DistanceByConsignee { get; set; }
        public string CWClientId { get; set; } 
        public string NTN { get; set; }
        public string STRN { get; set; }
        public bool IsActive { get; set; }
        public List<ClientInvoiceFormat> Details { get; set; } = new List<ClientInvoiceFormat>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Client()
        {
        }
        #endregion

        #region internal methods
        internal static Client Get(short clientId, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientById"))
                {
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new Client
                            {
                                ClientId = Convert.ToInt16(dr["ClientId"]),
                                AccountId = Convert.ToInt16(dr["AccountId"]),
                                ClientName = dr["ClientName"].ToString(),
                                ShortName = dr["ShortName"].ToString(),
                                CityId = Convert.ToInt16(dr["CityId"]),
                                IndustryVerticalId = Convert.ToInt16(dr["IndustryVerticalId"]),
                                //Terms = dr["ContractTerms"].ToString(),
                                ContractPeriod = Convert.ToInt16(dr["ContractPeriod"]),
                                Address = dr["Address"].ToString(),
                                ContactNo = dr["ContactNo"].ToString(),
                                ContactPerson = dr["ContactPerson"].ToString(),
                                Email = dr["Email"].ToString(),
                                URL = dr["Url"].ToString(),
                                CreditLimit = Convert.ToDecimal(dr["CreditLimit"]),
                                CreditDays = Convert.ToInt16(dr["CreditDays"]),
                                //StandardLoadingTime = Convert.ToInt32(dr["StandardLoadingTime"]),
                                PaymentModeId = Convert.ToInt16(dr["PaymentModeId"]),
                                RateTypeId = agHelper.sDBNull(dr["RateTypeId"]),
                                //DetGraceHRs = Convert.ToInt16(dr["DetGraceHRs"]),
                                //InvoiceModeId = Convert.ToInt16(dr["InvoiceModeId"]),
                                CWClientId = dr["CWClientId"].ToString(),
                                //MaxInvAmount = Convert.ToDecimal(dr["MaxInvAmount"]),
                                //MaxShipment = Convert.ToInt16(dr["MaxShipmentCount"]),
                                //WaiverTon = Convert.ToDecimal(dr["WaiverTon"]),
                                //DistanceByConsignee = Convert.ToBoolean(dr["DistanceByConsignee"]),
                                NTN = dr["NTN"].ToString(),
                                STRN = dr["STRN"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"]),
                                Footer = new agFooter(dr),
                                Details = ClientInvoiceFormat.Get(clientId),
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        internal static bool Save(Client c, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClient"))
                {
                    db.AddInParameter(dbCommand, "Clientid", SqlDbType.SmallInt, c.ClientId);
                    db.AddInParameter(dbCommand, "AccountId", SqlDbType.SmallInt, c.AccountId);
                    db.AddInParameter(dbCommand, "ClientName", SqlDbType.VarChar, c.ClientName);
                    db.AddInParameter(dbCommand, "ShortName", SqlDbType.VarChar, c.ShortName);
                    db.AddInParameter(dbCommand, "Address", SqlDbType.VarChar, c.Address);
                    db.AddInParameter(dbCommand, "CityId", SqlDbType.SmallInt, c.CityId);
                    db.AddInParameter(dbCommand, "IndustryVerticalId", SqlDbType.SmallInt, c.IndustryVerticalId);
                    db.AddInParameter(dbCommand, "ContractPeriod", SqlDbType.Int, c.ContractPeriod);
                    db.AddInParameter(dbCommand, "ContactPerson", SqlDbType.VarChar, c.ContactPerson);
                    db.AddInParameter(dbCommand, "ContactNo", SqlDbType.VarChar, c.ContactNo);
                    db.AddInParameter(dbCommand, "Email", SqlDbType.VarChar, c.Email);
                    db.AddInParameter(dbCommand, "URL", SqlDbType.VarChar, c.URL);
                    db.AddInParameter(dbCommand, "CreditDays", SqlDbType.Int, c.CreditDays);
                    db.AddInParameter(dbCommand, "CreditLimit", SqlDbType.Decimal, c.CreditLimit);
                    //db.AddInParameter(dbCommand, "StandardLoadingTime", SqlDbType.Decimal, c.StandardLoadingTime);
                    db.AddInParameter(dbCommand, "PaymentModeId", SqlDbType.TinyInt, c.PaymentModeId);
                    db.AddInParameter(dbCommand, "CWClientId", SqlDbType.VarChar, c.CWClientId);
                    db.AddInParameter(dbCommand, "NTN", SqlDbType.VarChar, c.NTN);
                    db.AddInParameter(dbCommand, "STRN", SqlDbType.VarChar, c.STRN);
                    //db.AddInParameter(dbCommand, "RateTypeId", SqlDbType.TinyInt, c.RateTypeId);
                    //db.AddInParameter(dbCommand, "DetGraceHRs", SqlDbType.TinyInt, c.DetGraceHRs);
                    //db.AddInParameter(dbCommand, "InvoiceModeId", SqlDbType.TinyInt, c.InvoiceModeId);
                    //db.AddInParameter(dbCommand, "MaxInvAmount", SqlDbType.Decimal, c.MaxInvAmount);
                    //db.AddInParameter(dbCommand, "MaxShipment", SqlDbType.SmallInt, c.MaxShipment);
                    //db.AddInParameter(dbCommand, "WaiverTon", SqlDbType.Decimal, c.WaiverTon);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit,c.IsActive);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, c.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newClientId", SqlDbType.SmallInt, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    c.ClientId = Convert.ToInt16(dbCommand.Parameters["@newClientId"].Value);
                    ClientInvoiceFormat.Save(c.ClientId, c.Details, userId, transaction);
                    transaction.Commit();                   
                    return true;
                }
            }
            catch(Exception ex) { transaction.Rollback(); throw ex; }
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