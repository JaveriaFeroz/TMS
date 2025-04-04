using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsClaim3rdParty : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public string PartyName { get; set; }
        public string CNIC { get; set; }        
        public decimal Amount { get; set; }
        public bool PaidInAdv { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InsClaim3rdParty()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsClaim3rdParty> Get(int claimId)
        {
            List<InsClaim3rdParty> parties = new List<InsClaim3rdParty>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getInsClaimPartiesById"))
            {
                db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            parties.Add(new InsClaim3rdParty
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                PartyName = dr["PartyName"].ToString(),
                                CNIC = dr["CNIC"].ToString(),
                                Amount = Convert.ToDecimal(dr["Amount"]),
                                PaidInAdv = Convert.ToBoolean(dr["PaidInAdv"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return parties;
        }

        internal static bool Save(int claimId, List<InsClaim3rdParty> details, string userId, DbTransaction transaction)
        {
            foreach (InsClaim3rdParty icp in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsClaimParty"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, icp.DetailId);
                    db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, icp.Amount);
                    db.AddInParameter(dbCommand, "PartyName", SqlDbType.VarChar, icp.PartyName);
                    db.AddInParameter(dbCommand, "CNIC", SqlDbType.VarChar, icp.CNIC);
                    db.AddInParameter(dbCommand, "PaidInAdv", SqlDbType.Bit, icp.PaidInAdv);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                         icp.Delete ? "D" : (icp.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
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
