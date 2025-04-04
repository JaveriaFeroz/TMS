using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class GroupInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? GroupInvoiceId { get; set; }
        public string GroupInvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public short? ClientId { get; set; }
        public List<GroupInvoiceDetail> Details { get; set; } = new List<GroupInvoiceDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public GroupInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static GroupInvoice Get(string invoiceNo, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGroupInvoiceByNo"))
            {
                db.AddInParameter(dbCommand, "GroupInvoiceNo", SqlDbType.VarChar, invoiceNo);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new GroupInvoice
                        {
                            GroupInvoiceId = Convert.ToInt32(dr["GroupInvoiceId"]),
                            GroupInvoiceNo = invoiceNo,
                            InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]),
                            ClientId = Convert.ToInt16(dr["ClientId"]),
                            Details = GroupInvoiceDetail.Get(Convert.ToInt32(dr["GroupInvoiceId"])),
                            Footer = new agFooter()
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(GroupInvoice gi, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGroupInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceDate", SqlDbType.DateTime, gi.InvoiceDate);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, gi.ClientId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newGroupInvoiceId", SqlDbType.Int, 32);
                    db.AddOutParameter(dbCommand, "newGroupInvoiceNo", SqlDbType.VarChar, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    gi.GroupInvoiceId = Convert.ToInt32(dbCommand.Parameters["@newGroupInvoiceId"].Value);
                    gi.GroupInvoiceNo = dbCommand.Parameters["@newGroupInvoiceNo"].Value.ToString();
                    GroupInvoiceDetail.Save(gi.GroupInvoiceId.Value, gi.Details, transaction);
                    Invoice.Issue(gi.GroupInvoiceId.Value, (short)agEnums.WorkFlow.GroupInvoice, companyId, transaction);
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
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}