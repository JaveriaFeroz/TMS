using System;

namespace TMSAPI.Areas.Common.Models
{
    public class Forms
    {
        #region private properties
        #endregion

        #region public properties
        public short WorkFlowId { get; set; }
        public string WorkFlowName { get; set; }
        public string FormId { get; set; }
        public string StateName { get; set; }
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public string SentOn { get; set; }
        public string SubmissionComments { get; set; }
        public string TrackingKey { get; set; }
        public decimal DocumentValue { get; set; }
        public string Route { get; set; }
        #endregion

        #region constrcutor
        public Forms() { }
        #endregion
    }
}