using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class UserCity :IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? UserCityId { get; set; }
        public short CityId { get; set; }
        public string CityName { get; set; }
        public bool Allowed { get; set; }
        public bool Edit { get; set; }
        #endregion

        #region constructor
        public UserCity()
        {

        }
        #endregion

        #region internal methods
        internal static List<UserCity> Get(string _userId)
        {
            List<UserCity> cities = new List<UserCity>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserCitiesById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                cities.Add(new UserCity
                                {
                                    //dr["UserCityId"],
                                    CityId = Convert.ToInt16(dr["CityId"]),
                                    CityName = dr["CityName"].ToString(),
                                    Allowed = Convert.ToBoolean(dr["Allowed"])
                                });
                            }
                        }
                    }
                }
                return cities;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string _userId, List<UserCity> _cities, DbTransaction _transaction, string _updatedBy)
        {
            try
            {
                foreach (UserCity uc in agHelper.GetEdits(_cities))
                {
                    using (DbCommand dbCommanddetail = db.GetStoredProcCommand("SaveUserCity"))
                    {
                        //db.AddInParameter(dbCommanddetail, "UserCityId", SqlDbType.VarChar, uc.UserCityId);
                        db.AddInParameter(dbCommanddetail, "NewUserId", SqlDbType.VarChar, _userId);
                        db.AddInParameter(dbCommanddetail, "CityId", SqlDbType.SmallInt, uc.CityId);
                        db.AddInParameter(dbCommanddetail, "Allowed", SqlDbType.Bit, uc.Allowed);
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