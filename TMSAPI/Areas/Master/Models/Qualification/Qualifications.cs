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
    public class Qualifications
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short QualificationId { get; set; }
        [DataMember(Order = 1)]       
        public string QualificationName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Qualifications()
        {
        }
        #endregion

        #region internal methods
        internal static List<Qualifications> Get()
        {
            List<Qualifications> qualifications = new List<Qualifications>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetQualifications"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            qualifications.Add(new Qualifications
                            {
                                QualificationId = Convert.ToInt16(dr["QualificationId"]),
                                QualificationName = dr["QualificationName"].ToString()
                            });
                        }
                    }
                }
            }
            return qualifications;
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