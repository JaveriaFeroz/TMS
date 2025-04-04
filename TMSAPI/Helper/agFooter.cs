using System;
using System.Data;

namespace TMSAPI.Helper
{
    public class agFooter
    {
        #region public properties
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; } = null;
        public DateTime? UpdatedOn { get; set; } = null;
        #endregion

        #region constructor
        public agFooter()
        {

        }

        public agFooter(string _createdBy, object _createdOn, string _updatedBy, object _updatedOn)
        {
            CreatedBy = _createdBy;
            CreatedOn = agHelper.dtDBNull(_createdOn);
            UpdatedBy = _updatedBy;
            UpdatedOn = agHelper.dtDBNull(_updatedOn);
        }

        public agFooter(DataRow dr)
        {
            CreatedBy = dr["CreatedBy"].ToString();
            CreatedOn = agHelper.dtDBNull(dr["CreatedOn"]);
            if (dr.Table.Columns.Contains("UpdatedBy"))
            {
                UpdatedBy = dr["UpdatedBy"].ToString();
                UpdatedOn = agHelper.dtDBNull(dr["UpdatedOn"]);
            }
        }

        //public agFooter(string _createdBy, object _createdOn)
        //{
        //    CreatedBy = _createdBy;
        //    if (_createdOn != DBNull.Value)
        //        CreatedOn = Convert.ToDateTime(_createdOn);
        //    UpdatedBy = null;
        //    UpdatedOn = null;
        //}
        #endregion
    }
}
