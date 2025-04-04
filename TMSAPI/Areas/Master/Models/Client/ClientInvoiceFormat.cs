using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class ClientInvoiceFormat
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short? FormatId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public ClientInvoiceFormat()
        {
        }
        #endregion

        #region internal methods
        internal static List<ClientInvoiceFormat> Get(short _clientid)
        {
            List<ClientInvoiceFormat> formats = new List<ClientInvoiceFormat>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientInvoiceFomats"))
            {
                db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, _clientid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            formats.Add(new ClientInvoiceFormat
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                FormatId = Convert.ToInt16(dr["FormatId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return formats;
        }

        internal static bool Save(short? clientid, List<ClientInvoiceFormat> details, string userId, DbTransaction transaction)
        {
            foreach (ClientInvoiceFormat cif in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveClientInvoiceFormat"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, cif.DetailId);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, clientid);
                    db.AddInParameter(dbCommand, "FormatId", SqlDbType.SmallInt, cif.FormatId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               cif.Delete ? "D" : (cif.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}