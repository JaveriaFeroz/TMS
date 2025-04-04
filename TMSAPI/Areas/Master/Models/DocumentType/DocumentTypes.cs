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
    public class DocumentTypes 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TypeId { get; set; }
        [DataMember(Order = 1)]
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public DocumentTypes()
        {

        }
        #endregion
        
        #region internal methods
        internal static List<DocumentTypes> GetForAsset(bool _activeOnly = true)
        {
            return get("GetAssetDocumentTypes", _activeOnly);
        }

        internal static List<DocumentTypes> GetForDriver(bool _activeOnly = true)
        {
            return get("GetDriverDocumentTypes", _activeOnly);
        }

        internal static List<DocumentTypes> GetForInsurance(bool _activeOnly = true)
        {
            return get("GetInsDocumentTypes", _activeOnly);
        }
        #endregion

        #region private methods
        private static List<DocumentTypes> get(string spName, bool _activeOnly = true)
        {
            List<DocumentTypes> types = new List<DocumentTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            types.Add(new DocumentTypes
                            {
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString()
                            });
                        }
                    }
                }
            }
            return types;
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
