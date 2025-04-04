using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class GroupInvoices 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string GroupInvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string ClientName { get; set; }
        #endregion

        #region constructor
        public GroupInvoices()
        {
        }
        #endregion

        #region internal methods
        internal static List<GroupInvoices> Get(short companyId, string userId)
        {
            List<GroupInvoices> invoices = new List<GroupInvoices>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGroupInvoices"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            invoices.Add(new GroupInvoices
                            {
                                GroupInvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                ClientName = dr["ClientName"].ToString()
                            });
                        }
                    }
                }
            }
            return invoices;
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
