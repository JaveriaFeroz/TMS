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
    public class MedicalTests
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short TestId { get; set; }
        [DataMember(Order = 1)]       
        public string TestName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public MedicalTests()
        {
        }
        #endregion

        #region internal methods
        internal static List<MedicalTests> Get(bool _activeOnly = true)
        {
            List<MedicalTests> tests = new List<MedicalTests>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetMedicalTests"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            tests.Add(new MedicalTests
                            {
                                TestId = Convert.ToInt16(dr["TestId"]),
                                TestName = dr["TestName"].ToString()
                            });
                        }
                    }
                }
            }
            return tests;
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
