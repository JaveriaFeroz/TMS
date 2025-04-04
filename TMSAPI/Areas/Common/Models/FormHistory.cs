using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Common.Models
{
    [DataContract]
    public class FormHistory
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public string StateName { get; set; }
        public string SentOn { get; set; }
        public string Remarks { get; set; }
        #endregion

        #region constructor
        public FormHistory()
        {

        }
        #endregion

        #region internal methods
        internal static List<FormHistory> Get(int _formId, short _workflowId)
        {
            List<FormHistory> formhistory = new List<FormHistory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFormHistory"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _formId);
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.TinyInt, _workflowId);

                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            formhistory.Add(new FormHistory
                            {
                                Sender = dr["SenderName"].ToString(),
                                Recipient = dr["ReceiverName"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                SentOn = dr["SentOn"].ToString(),
                                Remarks = dr["SubmissionComments"].ToString()
                            });
                        }
                    }
                }
            }
            return formhistory;
        }
        #endregion
    }
}