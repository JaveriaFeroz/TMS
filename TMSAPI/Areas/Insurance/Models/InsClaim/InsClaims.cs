using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsClaims 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ClaimId { get; set; }
        public string ClaimDate { get; set; }
        public string VehicleNo { get; set; }
        public string AccidentDate { get; set; }
        public string InsuranceTypeName { get; set; }
        #endregion

        #region constructor
        public InsClaims()
        {
        }
        #endregion

        #region internal functions
        internal static List<InsClaims> Get(short companyId, string userId)
        {
            List<InsClaims> claims = new List<InsClaims>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsClaims"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            claims.Add(new InsClaims
                            {
                                ClaimId = Convert.ToInt16(dr["ClaimId"]),
                                ClaimDate = dr["ClaimDate"].ToString(),
                                VehicleNo = dr["AssetNo"].ToString(),
                                AccidentDate = dr["AccidentDate"].ToString(),
                                InsuranceTypeName = dr["InsuranceTypeName"].ToString()
                            });
                        }
                    }
                }
            }
            return claims;
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