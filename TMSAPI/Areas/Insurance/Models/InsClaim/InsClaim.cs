using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsClaim : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ClaimId { get; set; }
        public DateTime ClaimDate { get; set; }
        public short? CompanyId { get; set; }
        public short AssetId { get; set; }
        public short? PolicyId { get; set; }
        public DateTime? AccidentDate { get; set; }
        public string AccidentLocation { get; set; }
        public string WorkShopName { get; set; }
        public short TypeId { get; set; }
        public string Remarks { get; set; }
        public string PolicyNo { get; set; }
        public string LossNo { get; set; }
        public string SurveyorName { get; set; }
        public decimal? Amount { get; set; }
        public decimal? MinDeductible { get; set; }
        public decimal? AmountRcvd { get; set; }
        public string ChequeNo { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string BankName { get; set; }
        public short WorkFlowId { get; set; }
        public short StateId { get; set; }
        public bool Completed { get; set; } = false;
        public List<InsClaimDriver> Drivers { get; set; } = new List<InsClaimDriver>();
        public List<InsClaimDoc> Documents { get; set; } = new List<InsClaimDoc>();
        public List<InsClaim3rdParty> Parties { get; set; } = new List<InsClaim3rdParty>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InsClaim()
        {
        }
        #endregion

        #region internal methods
        internal static InsClaim Get(int claimId, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsClaimById"))
                {
                    db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new InsClaim
                            {
                                ClaimId = Convert.ToInt32(dr["ClaimId"]),
                                ClaimDate = Convert.ToDateTime(dr["ClaimDate"]),
                                AssetId = Convert.ToInt16(dr["AssetId"]),
                                PolicyId = Convert.ToInt16(dr["PolicyId"]),
                                AccidentDate = Convert.ToDateTime(dr["AccidentDate"]),
                                AccidentLocation = dr["AccidentLocation"].ToString(),
                                WorkShopName = dr["WorkShopName"].ToString(),
                              //  WorkFlowId = Convert.ToInt16(dr["WorkFlowId"]),
                                StateId = Convert.ToInt16(dr["StateId"]),
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                LossNo = dr["LossNo"].ToString(),
                                SurveyorName = dr["Surveyor"].ToString(),
                                Remarks = dr["Remarks"].ToString(),
                                Completed = Convert.ToBoolean(dr["Closed"]),
                                PolicyNo = dr["PolicyNo"].ToString(),
                                Amount = agHelper.dDBNull(dr["ClaimAmount"]),
                                MinDeductible = agHelper.dDBNull(dr["MinDeductible"]),
                                AmountRcvd = agHelper.dDBNull(dr["AmountRecovered"]),
                                ChequeNo = dr["ChequeNo"].ToString(),
                                ChequeDate = agHelper.dtDBNull(dr["ChequeDate"]),
                                BankName = dr["BankName"].ToString(),
                                Drivers = InsClaimDriver.Get(claimId),
                                Documents = InsClaimDoc.Get(claimId),
                                Parties = InsClaim3rdParty.Get(claimId),
                                Footer = new agFooter(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(InsClaim ic, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsClaim"))
                {
                    #region claim main section
                    db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, ic.ClaimId);
                    db.AddInParameter(dbCommand, "ClaimDate", SqlDbType.DateTime, ic.ClaimDate);
                    db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, ic.AssetId);
                    db.AddInParameter(dbCommand, "PolicyId", SqlDbType.Int, ic.PolicyId);
                    db.AddInParameter(dbCommand, "AccidentDate", SqlDbType.DateTime, ic.AccidentDate);
                    db.AddInParameter(dbCommand, "AccidentLocation", SqlDbType.VarChar, ic.AccidentLocation);
                    db.AddInParameter(dbCommand, "WorkShopName", SqlDbType.VarChar, ic.WorkShopName);
                    db.AddInParameter(dbCommand, "Surveyor", SqlDbType.VarChar, ic.SurveyorName);
                    db.AddInParameter(dbCommand, "LossNo", SqlDbType.VarChar, ic.LossNo);
                    db.AddInParameter(dbCommand, "StateId", SqlDbType.SmallInt, ic.StateId);
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, ic.TypeId);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, ic.Remarks);
                    #endregion

                    #region claim recovery
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, ic.Amount);
                    db.AddInParameter(dbCommand, "MinDeductible", SqlDbType.Float, ic.MinDeductible);
                    db.AddInParameter(dbCommand, "AmountRcvd", SqlDbType.Float, ic.AmountRcvd);
                    db.AddInParameter(dbCommand, "ChequeNo", SqlDbType.VarChar, ic.ChequeNo);
                    db.AddInParameter(dbCommand, "ChequeDate", SqlDbType.DateTime, ic.ChequeDate);
                    db.AddInParameter(dbCommand, "BankName", SqlDbType.VarChar, ic.BankName);
                    #endregion

                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ic.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newClaimId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    ic.ClaimId = Convert.ToInt32(dbCommand.Parameters["@newClaimId"].Value);

                    InsClaimDriver.Save(ic.ClaimId.Value, ic.Drivers, userId, transaction);
                    InsClaim3rdParty.Save(ic.ClaimId.Value, ic.Parties, userId, transaction);
                    InsClaimDoc.Remove(ic.ClaimId.Value, ic.Documents, userId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        internal static bool Close(int claimId, short companyId, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("CompleteInsClaim");
                db.AddInParameter(dbCommandDetail, "ClaimId", SqlDbType.Int, claimId);
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommandDetail);
                return true;
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