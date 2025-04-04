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
    public class UoMs : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order=0)]
        public short UoMId { get; set; }
        [DataMember(Order = 1)]
        public string UoMName { get; set; }
        #endregion

        #region constructor
        public UoMs()
        {
        }
        #endregion

        #region internal methods
        internal static List<UoMs> Get(bool _activeOnly = true)
        {
            List<UoMs> uoms = new List<UoMs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetUOMs"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            uoms.Add(new UoMs
                            {
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                UoMName = dr["UoMName"].ToString()
                            });
                        }
                    }
                }
            }
            return uoms;
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
