using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Common.Models
{
    public class MyForm
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public List<Forms> MyForms { get; set; } = new List<Forms>();
        #endregion

        #region constructor
        public MyForm()
        {
        }
        #endregion

        #region internal methods
        internal static List<Forms> ActiveForms( short _workflowId, short companyId, string _owner)
        {
            return getForms("GetForms_Active", _workflowId, companyId, _owner);
        }

        internal static List<Forms> SentForms(short _workflowId, short companyId, string _owner)
        {
            return getForms("GetForms_Sent", _workflowId, companyId, _owner);
        }

        internal static List<Forms> CompletedForms(short _workflowId, short companyId, string _owner)
        {
            return getForms("GetForms_Completed", _workflowId, companyId, _owner);
        }
        #endregion

        #region private methods
        /// <summary>
        /// returns list of forms in summarized way
        /// </summary>
        /// <param name="_spName">The stored procedure name to be invoked</param>
        /// <param name="_workflowId">Specific workflow Type, 0 for all</param>
        /// <param name="_userid">User Id to be passed to Stored Procedure for return of relevant data</param>
        /// <returns></returns>
        private static List<Forms> getForms(string _spName, short _workflowId, short companyId, string _userid)
        {
            List<Forms> lstFL = new List<Forms>();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand(_spName))
                {
                    db.AddInParameter(dbCommand, "workflowId", SqlDbType.SmallInt, _workflowId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            using (DataTable dt = ds.Tables[0])
                            {
                                foreach (DataRow dr in dt.Rows)
                                {
                                    lstFL.Add(new Forms
                                    {
                                        FormId = dr["FormId"].ToString(),
                                        StateName = dr["StateName"].ToString(),
                                        Sender = dr["Sender"].ToString(),
                                        Recipient = dr["Owner"].ToString(),
                                        SentOn = dr["SentOn"].ToString(),
                                        SubmissionComments = dr["SubmissionComments"].ToString(),
                                        WorkFlowId = Convert.ToInt16(dr["workflowId"]),
                                        WorkFlowName = dr["WorkFlowName"].ToString(),
                                        DocumentValue = Convert.ToDecimal(dr["DocumentValue"]),
                                        TrackingKey = dr["TrackingKey"].ToString(),
                                        Route = dr["Route"].ToString()
                                    });
                                }
                            }
                        }
                    }
                }
                return lstFL;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}