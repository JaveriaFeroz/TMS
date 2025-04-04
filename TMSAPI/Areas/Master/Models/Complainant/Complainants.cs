using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class Complainants
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short ComplainantId { get; set; }
        [DataMember(Order = 1)]
        public string ComplainantName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Complainants()
        {
        }

        public Complainants(short _complainantId, string _complainantName, bool _isActive)
        {
            ComplainantId = _complainantId;
            ComplainantName = _complainantName;
            IsActive = _isActive;
        }
        #endregion

        #region internal methods
        internal static List<Complainants> Get(bool _activeOnly = true)
        {
            try
            {
                List<Complainants> lstC = new List<Complainants>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetComplainants"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                lstC.Add(new Complainants(
                                    Convert.ToInt16(dr["ComplainantId"]),
                                    dr["ComplainantName"].ToString(),
                                Convert.ToBoolean(dr["IsActive"])));
                            }
                        }
                    }
                }
                return lstC;
            }
            catch (Exception) { throw; }
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
