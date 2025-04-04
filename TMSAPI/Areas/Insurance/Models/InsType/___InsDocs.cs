using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Insurance.Models
{

    public class ___InsDocs : IDisposable
    {
        #region private properties
            private static SqlDatabase db = DatabaseFactory.CreateDatabase("Maintenace_Connection") as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short DocumentId { get; set; }
        [DataMember(Order = 1)]
        public string DocumentName { get; set; }
        [DataMember(Order = 2)]
        public bool Mandatory { get; set; }
        #endregion

        #region constructor
        public ___InsDocs()
        {

        }

        public ___InsDocs(short _documentId, string _documentName, bool _mandatory)
        {
            DocumentId = _documentId;
            DocumentName = _documentName;
            Mandatory = _mandatory;
        }
        #endregion

        #region internal methods
        internal static List<___InsDocs> Get(bool _activeOnly = true)
        {
            List<___InsDocs> lDTL = new List<___InsDocs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsuranceDocuments"))
            {
                db.AddInParameter(dbCommand, "activeOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ___InsDocs il = new ___InsDocs(
                                Convert.ToInt16(dr["DocumentId"]),
                                dr["DocumentName"].ToString(), false);
                            lDTL.Add(il);
                        }
                    }
                }
            }
            return lDTL;
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
