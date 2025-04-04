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
    public class Makes
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short MakeId { get; set; }
        public string MakeName { get; set; }
        #endregion

        #region constructor
        public Makes()
        {
        }
        #endregion

        #region internal methods
        internal static List<Makes> Get(bool _activeOnly = true)
        {
            List<Makes> makes = new List<Makes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetMakes"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            makes.Add(new Makes
                            {
                                MakeId = Convert.ToInt16(dr["MakeId"]),
                                MakeName = dr["MakeName"].ToString()
                            });
                        }
                    }
                }
            }
            return makes;
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