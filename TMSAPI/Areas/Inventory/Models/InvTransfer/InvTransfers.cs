using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Inventory.Models
{
    public class InvTransfers : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int TransferId { get; set; }
        public string TransferDate { get; set; }
        public string FromBranchName { get; set; }
        public string ToBranchName { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public InvTransfers()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvTransfers> Get(short companyId, string userId)
        {
            List<InvTransfers> transfers = new List<InvTransfers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvTransfers"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            transfers.Add(new InvTransfers
                            {
                                TransferId = Convert.ToInt32(dr["TransferId"]),
                                TransferDate = dr["TransferDate"].ToString(),
                                FromBranchName = dr["FromBranchName"].ToString(),
                                ToBranchName = dr["ToBranchName"].ToString(),
                                StateName = dr["StateName"].ToString()
                            });
                        }
                    }
                }
            }
            return transfers;
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
