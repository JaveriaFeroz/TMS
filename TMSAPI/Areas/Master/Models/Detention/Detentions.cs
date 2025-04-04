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
    public class Detentions 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short DetentionId { get; set; }
        [DataMember(Order = 2)]
        public string DetentionName { get; set; }
        [DataMember(Order = 3)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Detentions()
        {

        }
        #endregion

        #region internal methods
        internal static List<Detentions> Get(bool _activeOnly = true)
        {
            List<Detentions> detentions = new List<Detentions>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDetentions"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            detentions.Add(new Detentions
                            {
                                DetentionId = Convert.ToInt16(dr["DetentionId"]),
                                DetentionName = dr["DetentionName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return detentions;
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