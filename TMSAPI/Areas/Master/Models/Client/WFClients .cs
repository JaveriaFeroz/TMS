using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Master.Models
{
    //this class will be further worked upon later
    public class WFClients
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties   
        public short FormId { get; set; }
        public short ClientId { get; set; }      
        public string ClientName { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public WFClients()
        {
        }
        #endregion

        #region internal methods
        internal static List<WFClients> GetPendingForms(short companyId, string userid)
        {
            try
            {
                List<WFClients> forms = new List<WFClients>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetWFClientRates"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                forms.Add(new WFClients
                                {
                                    FormId = Convert.ToInt16(dr["FormId"]),
                                    ClientId = Convert.ToInt16(dr["ClientId"]),
                                    ClientName = dr["ClientName"].ToString(),
                                    StateName = dr["StatusName"].ToString()
                                });
                            }
                        }
                    }
                }
                return forms;
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
