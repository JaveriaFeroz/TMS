namespace TMSAPI.Areas.Common.Models
{
    public class Submission
    {
        #region public properties
        public int? FormId { get; set; }
        public short StateId { get; set; }
        public string Owner { get; set; }
        public string UserId { get; set; }
        public string Comments { get; set; }
        public string RemarksColumn { get; set; }
        public string Remarks { get; set; }
        public bool Rejected { get; set; } = false;
        public bool Approved { get; set; } = false;
        public bool Completed { get; set; }
        #endregion

        #region constructor
        public Submission()
        {
        }
        #endregion
    }
}