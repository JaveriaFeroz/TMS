using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class InvoiceFormats : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order=0)]
        public short FormatId { get; set; }
        [DataMember(Order = 1)]
        public string FormatName { get; set; }
        #endregion

        #region constructor
        public InvoiceFormats()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvoiceFormats> Get()
        {
            List<InvoiceFormats> formats = new List<InvoiceFormats>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceFormats"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            formats.Add(new InvoiceFormats
                            {
                                FormatId = Convert.ToInt16(dr["FormatId"]),
                                FormatName = dr["FormatName"].ToString()
                            });
                        }
                    }
                }
            }
            return formats;
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
