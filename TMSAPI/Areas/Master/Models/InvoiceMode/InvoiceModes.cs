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
    public class InvoiceModes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short ModeId { get; set; }
        public string ModeName { get; set; }
        #endregion

        #region constructor
        public InvoiceModes()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvoiceModes> Get()
        {
            List<InvoiceModes> modes = new List<InvoiceModes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceModes"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            modes.Add(new InvoiceModes
                            {
                                ModeId = Convert.ToInt16(dr["ModeId"]),
                                ModeName = dr["ModeName"].ToString()
                            });
                        }
                    }
                }
            }
            return modes;
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
