using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Common.Models
{
    public partial class UserAccess
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short OptionId { get; set; }
        public string OptionName { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        #endregion

        #region constructors
        public UserAccess()
        {

        }
         
        //public UserAccess(short _optionId, string _optionName, bool _canAdd, bool _canEdit, bool _canDelete)
        //{
        //    OptionId = _optionId;
        //    OptionName = _optionName;
        //    CanAdd = _canAdd;
        //    CanEdit = _canEdit;
        //    CanDelete = _canDelete;
        //}
        #endregion

        #region internal methods
        internal static List<UserAccess> Get(string _userId)
        {
            List<UserAccess> access = new List<UserAccess>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessForUser"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                using DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0];
                if (dt != null)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        access.Add(new UserAccess
                        {
                            OptionId = Convert.ToInt16(dr["OptionId"]),
                            OptionName = dr["OptionName"].ToString(),
                            CanAdd = Convert.ToBoolean(dr["CanAdd"]),
                            CanEdit = Convert.ToBoolean(dr["CanEdit"]),
                            CanDelete = Convert.ToBoolean(dr["CanDelete"])
                        });
                    }
                }
            }
            return access;
        }
        #endregion
    }
}