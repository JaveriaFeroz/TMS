using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class ChequeBookDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? BookId { get; set; }
        public string BookName { get; set; }
        public string AccountName { get; set; }
        public int StartChqNo { get; set; }
        public int EndChqNo { get; set; }
        #endregion

        #region constructor
        public ChequeBookDetail()
        {
        }
        //public ChequeBookDetail(int _ChequeBookId, int _StartingChequeNo, int _EndingChequeNo, short _BankAccountId, string _IssuanceDate, string _ChequeBookName)
        //{
        //    CBId = _ChequeBookId;
        //    FirstChequeNo = _StartingChequeNo;
        //    LastChequeNo = _EndingChequeNo;
        //    AccountId = _BankAccountId;
        //    IssueDate = _IssuanceDate;
        //    ChequeBookName = _ChequeBookName;
        //    Add = false; 
        //}

        //public ChequeBookDetail(int _ChequeBookId, string _ChequeBookName, short _BankAccountId, int _ChequeId, string _ChequeNo)
        //{
        //    CBId = _ChequeBookId;
        //    ChequeBookName = _ChequeBookName;
        //    AccountId = _BankAccountId;
        //    ChequeId = _ChequeId;
        //    ChequeNo = _ChequeNo;
        //}
        #endregion

        #region internal methods
        internal static List<ChequeBookDetail> Get(short companyId, string userId)
        {
            List<ChequeBookDetail> documents = new List<ChequeBookDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetChequeBooks"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            documents.Add(new ChequeBookDetail
                            {
                                BookId = Convert.ToInt16(dr["BookId"]),
                                BookName = dr["BookName"].ToString(),
                                AccountName = dr["AccountName"].ToString(),
                                StartChqNo = Convert.ToInt32(dr["StartChqNo"]),
                                EndChqNo = Convert.ToInt32(dr["EndChqNo"])
                            });
                        }
                    }
                }
            }
            return documents;
        }
        #endregion
    }
}