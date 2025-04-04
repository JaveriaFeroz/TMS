using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Finance.Models
{
    public class ChequeBooks
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int BookId { get; set; }
        public string BookName { get; set; }
        public short? AccountId { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        #endregion

        #region constructor
        public ChequeBooks()
        {
        }
        #endregion

        #region internal methods
        internal static List<ChequeBooks> GetActive(short companyId, string userId)
        {
            try
            {
                List<ChequeBooks> books = new List<ChequeBooks>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetActiveChequeBooks"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                books.Add(new ChequeBooks
                                {
                                    BookId = Convert.ToInt32(dr["BookId"]),
                                    BookName = dr["BookName"].ToString(),
                                    AccountId = Convert.ToInt16(dr["BankAccountId"]),
                                    CreatedBy = dr["CreatedBy"].ToString(),
                                    CreatedOn = dr["CreatedOn"].ToString()
                                });
                            }
                        }
                    }
                }
                return books;
            }
            catch (Exception ex) { throw ex; }
        }
        #endregion
    }
}
