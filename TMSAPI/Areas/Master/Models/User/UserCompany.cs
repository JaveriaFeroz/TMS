using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class UserCompany :IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? UserCompanyId { get; set; }
        public short CompanyId { get; set; }
        public string CompanyName { get; set; }
        public bool Allowed { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructor
        public UserCompany()
        {

        }
        //internal UserCompany(object _userCompanyId, short _CompanyId, string _CompanyName, bool _selected)
        //{
        //    if (_userCompanyId != DBNull.Value)
        //        UserCompanyId = Convert.ToInt16(_userCompanyId);
        //    CompanyId = _CompanyId;
        //    CompanyName = _CompanyName;
        //    Selected = _selected;
        //}

        //internal UserCompany(short _CompanyId, string _CompanyName)
        //{            
        //    CompanyId = _CompanyId;
        //    CompanyName = _CompanyName;
        //}

        //internal UserCompany( short _CompanyId)
        //{         
        //    CompanyId = _CompanyId;
        //}
        #endregion

        #region internal methods
        internal static List<UserCompany> Get(string _userId)
        {
            List<UserCompany> companies = new List<UserCompany>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserCompaniesById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                companies.Add(new UserCompany
                                {
                                    //dr["UserCompanyId"],
                                    CompanyId = Convert.ToInt16(dr["CompanyId"]),
                                    CompanyName = dr["CompanyName"].ToString(),
                                    Allowed = Convert.ToBoolean(dr["Allowed"])
                                });
                            }
                        }
                    }
                }
                return companies;
            }
            catch (Exception) { throw; }
        }
   
        internal static List<UserCompany> GetAllowed(string _userId, bool _activeOnly = true)
        {
            List<UserCompany> companies = new List<UserCompany>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetCompanies"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommandDetail, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                companies.Add(new UserCompany
                                {
                                    CompanyId = Convert.ToInt16(dr["CompanyId"]),
                                    CompanyName = dr["CompanyName"].ToString()
                                });
                            }
                        }
                    }
                }
                return companies;
            }
            catch (Exception) { throw; }
        }

        internal static short? GetDefault(string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetUserDefaultCompany"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            return Convert.ToInt16(ds.Tables[0].Rows[0]["CompanyId"]);
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string _userId, List<UserCompany> _companies, DbTransaction _transaction, string _updatedBy)
        {
            try
            {
                foreach (UserCompany _ud in agHelper.GetEdits(_companies))
                {
                    using (DbCommand dbCommanddetail = db.GetStoredProcCommand("SaveUserCompany"))
                    {
                        //db.AddInParameter(dbCommanddetail, "UserCompanyId", SqlDbType.TinyInt, _ud.UserCompanyId);
                        db.AddInParameter(dbCommanddetail, "NewUserId", SqlDbType.VarChar, _userId);
                        db.AddInParameter(dbCommanddetail, "CompanyId", SqlDbType.TinyInt, _ud.CompanyId);
                        db.AddInParameter(dbCommanddetail, "Allowed", SqlDbType.Bit, _ud.Allowed);
                        db.AddInParameter(dbCommanddetail, "UserId", SqlDbType.VarChar, _updatedBy);
                        db.ExecuteNonQuery(dbCommanddetail, _transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region dispose method
        public void Dispose()
        {
        }
        #endregion
    }
}