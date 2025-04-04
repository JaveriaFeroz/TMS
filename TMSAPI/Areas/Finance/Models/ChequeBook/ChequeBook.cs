using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class ChequeBook : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? BookId { get; set; }
        public string BookName { get; set; }
        public short? AccountId { get; set; }
        public DateTime? IssueDate { get; set; } = DateTime.Now;
        public string Prefix { get; set; }
        public int? StartChqNo { get; set; }
        public int? EndChqNo { get; set; } 
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ChequeBook()
        {            
        }
        #endregion

        #region internal methods
        internal static ChequeBook Get(short bookId, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetChequeBookById"))
                {
                    db.AddInParameter(dbCommand, "BookId", SqlDbType.SmallInt, bookId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new ChequeBook
                            {
                                BookId = Convert.ToInt16(dr["BookId"]),
                                BookName = dr["BookName"].ToString(),
                                AccountId = Convert.ToInt16(dr["BankAccountId"]),
                                IssueDate = Convert.ToDateTime(dr["IssueDate"]),
                                Prefix = dr["Prefix"].ToString(),
                                StartChqNo = Convert.ToInt32(dr["StartChqNo"]),
                                EndChqNo = Convert.ToInt32(dr["EndChqNo"]),
                                Footer = new agFooter(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Save(ChequeBook cb, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveChequeBook"))
                {
                    db.AddInParameter(dbCommand, "BookId", SqlDbType.Int, cb.BookId);
                    db.AddInParameter(dbCommand, "BookName", SqlDbType.VarChar, cb.BookName);
                    db.AddInParameter(dbCommand, "BankAccountId", SqlDbType.SmallInt, cb.AccountId);
                    db.AddInParameter(dbCommand, "IssueDate", SqlDbType.DateTime, cb.IssueDate);
                    db.AddInParameter(dbCommand, "Prefix", SqlDbType.VarChar, cb.Prefix);
                    db.AddInParameter(dbCommand, "StartChqNo", SqlDbType.BigInt, cb.StartChqNo);
                    db.AddInParameter(dbCommand, "EndChqNo", SqlDbType.BigInt, cb.EndChqNo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception) { transaction.Rollback(); throw; }
        }
        #endregion

        #region disposal
        public void Dispose()
        {
        }
        #endregion
    }
}