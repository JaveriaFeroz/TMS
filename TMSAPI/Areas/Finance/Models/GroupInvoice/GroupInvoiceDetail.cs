using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class GroupInvoiceDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties        
        //public bool Selected { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string WorkFlowName { get; set; }
        public double Amount { get; set; }        
        #endregion

        #region constructor
        public GroupInvoiceDetail()
        {
           
        }
        #endregion

        #region internal methods
        internal static List<GroupInvoiceDetail> Get(int groupInvoiceId)
        {
            List<GroupInvoiceDetail> details = new List<GroupInvoiceDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetGroupInvoiceDetailById"))
            {
                db.AddInParameter(dbCommand, "GroupInvoiceId", SqlDbType.Int, groupInvoiceId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new GroupInvoiceDetail
                            {
                                //Selected = Convert.ToBoolean(dr["Selected"]),
                                InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                WorkFlowName = dr["WorkFlowName"].ToString(),
                                Amount = Convert.ToDouble(dr["NetAmount"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static List<GroupInvoiceDetail> GetPendingInvoices(short clientId, short companyId, string userId)
        {
            List<GroupInvoiceDetail> details = new List<GroupInvoiceDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoicesForGrouping"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new GroupInvoiceDetail
                            {
                                //Selected = Convert.ToBoolean(dr["Selected"]),
                                InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                WorkFlowName = dr["WorkFlowName"].ToString(),
                                Amount = Convert.ToDouble(dr["NetAmount"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int groupInvoiceId, List<GroupInvoiceDetail> details, DbTransaction transaction)
        {
            foreach (GroupInvoiceDetail gid in details)
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGroupInvoiceDetail"))
                {
                    db.AddInParameter(dbCommand, "GroupInvoiceId", SqlDbType.Int, groupInvoiceId);
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, gid.InvoiceId); 
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
