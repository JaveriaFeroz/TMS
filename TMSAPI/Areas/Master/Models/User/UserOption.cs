using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class UserOption : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? UserOptionId { get; set; }
        public short OptionId { get; set; }
        public string OptionName { get; set; }
        public bool Allowed { get; set; }
        public bool AllowAdd { get; set; }
        public bool AllowEdit { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructors
        public UserOption()
        {

        }

        //public UserOption(object _userOptionId, short _optionId, string _optionName,
        //    bool _allowAccess, bool _allowAdd, bool _allowEdit)
        //{

        //    if (_userOptionId != DBNull.Value)
        //        UserOptionId = Convert.ToInt16(_userOptionId);
        //    OptionId = _optionId;
        //    OptionName = _optionName;
        //    Allowed = _allowAccess;
        //    AllowAdd = _allowAdd;
        //    AllowEdit = _allowEdit;
        //    Edit = false;
        //}
        #endregion

        #region intenral methods
        internal static List<UserOption> Get(string _userId)
        {
            List<UserOption> options = new List<UserOption>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserOptionsById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                options.Add(new UserOption
                                {
                                    //dr["UserOptionId"],
                                    OptionId = Convert.ToInt16(dr["OptionId"]),
                                    OptionName = dr["OptionName"].ToString(),
                                    Allowed = Convert.ToBoolean(dr["IsVisible"]),
                                    AllowAdd = Convert.ToBoolean(dr["CanAdd"]),
                                    AllowEdit = Convert.ToBoolean(dr["CanEdit"])
                                });
                            }
                        }
                    }
                }
                return options;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string _userId, List<UserOption> _options, DbTransaction _transaction, string _updatedBy)
        {
            try
            {
                foreach (UserOption uo in agHelper.GetEdits(_options))
                {
                    using (DbCommand dbCommanddetail = db.GetStoredProcCommand("SaveUserOption"))
                    {
                        //db.AddInParameter(dbCommanddetail, "UserOptionId", SqlDbType.Int, uo.UserOptionId);
                        db.AddInParameter(dbCommanddetail, "NewUserId", SqlDbType.VarChar, _userId);
                        db.AddInParameter(dbCommanddetail, "OptionId", SqlDbType.SmallInt, uo.OptionId);
                        db.AddInParameter(dbCommanddetail, "Allowed", SqlDbType.Bit, uo.Allowed);
                        db.AddInParameter(dbCommanddetail, "AllowAdd", SqlDbType.Bit, uo.AllowAdd);
                        db.AddInParameter(dbCommanddetail, "AllowEdit", SqlDbType.Bit, uo.AllowEdit);
                        db.AddInParameter(dbCommanddetail, "UserId", SqlDbType.VarChar, _updatedBy);
                        db.ExecuteNonQuery(dbCommanddetail, _transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Member
        public void Dispose()
        {
        }
        #endregion
    }
}