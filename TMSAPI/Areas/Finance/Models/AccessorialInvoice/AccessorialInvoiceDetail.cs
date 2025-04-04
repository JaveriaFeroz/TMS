using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class AccessorialInvoiceDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ChargeId { get; set; }       
        public int Qty { get; set; }
        public double Price { get; set; }
        public string UoMName { get; set; }
        public double Amount { get; set; }
        #endregion

        #region constructor
        public AccessorialInvoiceDetail()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<AccessorialInvoiceDetail> Get(int InvoiceId)
        {
            List<AccessorialInvoiceDetail> details = new List<AccessorialInvoiceDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialInvoiceDetailById"))
            {
                db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, InvoiceId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new AccessorialInvoiceDetail
                            {
                                ChargeId = Convert.ToInt16(dr["AcId"]),
                                Qty = Convert.ToInt32(dr["Qty"]),
                                Price = Convert.ToDouble(dr["Rate"]),
                                UoMName = dr["UoMName"].ToString(),
                                Amount = Convert.ToDouble(dr["Amount"]),
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int InvoiceId, List<AccessorialInvoiceDetail> details, string userId, DbTransaction transaction)
        {
            foreach (AccessorialInvoiceDetail aid in details)// agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAccessorialInvoiceDetail"))
                {                  
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, InvoiceId);
                    db.AddInParameter(dbCommand, "AcId", SqlDbType.Int, aid.ChargeId);
                    db.AddInParameter(dbCommand, "Qty", SqlDbType.Int, aid.Qty);
                    db.AddInParameter(dbCommand, "Rate", SqlDbType.Float, aid.Price);
                    db.AddInParameter(dbCommand, "UoMName", SqlDbType.VarChar, aid.UoMName);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
