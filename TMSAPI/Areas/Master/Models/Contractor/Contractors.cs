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
    public class Contractors
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short ContractorId { get; set; }
        [DataMember(Order = 1)]       
        public string ContractorName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Contractors()
        {

        }
        #endregion

        #region internal methods
        internal static List<Contractors> Get(bool _activeOnly = true)
        {
            List<Contractors> contractors = new List<Contractors>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetContractors"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            contractors.Add(new Contractors
                            {
                                ContractorId = Convert.ToInt16(dr["ContractorId"]),
                                ContractorName = dr["ContractorName"].ToString()
                            });
                        }
                    }
                }
            }
            return contractors;
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
