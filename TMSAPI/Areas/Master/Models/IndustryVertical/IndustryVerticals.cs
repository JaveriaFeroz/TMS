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
    public class IndustryVerticals : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short VerticalId { get; set; }
        [DataMember(Order = 1)]
        public string VerticalName { get; set; }
        #endregion

        #region constructor
        public IndustryVerticals()
        {
        }
        #endregion

        #region internal methods
        internal static List<IndustryVerticals> Get(bool _activeOnly = true)
        {
            List<IndustryVerticals> verticals = new List<IndustryVerticals>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetIndustryVerticals"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            verticals.Add(new IndustryVerticals
                            {
                                VerticalId = Convert.ToInt16(dr["VerticalId"]),
                                VerticalName = dr["VerticalName"].ToString()
                            });
                        }
                    }
                }
            }
            return verticals;
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