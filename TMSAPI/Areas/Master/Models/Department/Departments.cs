using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class Departments
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        #endregion

        #region constructor
        public Departments()
        {
        }
        #endregion

        #region internal methods
        internal static List<Departments> Get(bool activeOnly = true)
        {
            List<Departments> departments = new List<Departments>();
            try
            {
                DbCommand dbCommand = db.GetStoredProcCommand("GetDepartments");
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            departments.Add(new Departments
                            {
                                DepartmentId = Convert.ToInt16(dr["DepartmentId"]),
                                DepartmentName = dr["DepartmentName"].ToString()
                            });
                        }
                    }
                }
                return departments;
            }
            catch (Exception) { throw; }
        }

        //internal static List<Departments> GetGLDepartments(bool _activeOnly = true)
        //{
        //    List<Departments> departments = new List<Departments>();
        //    try
        //    {
        //        DbCommand dbCommand = db.GetStoredProcCommand("GetGLDepartments");
        //        db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
        //        using (DataSet ds = db.ExecuteDataSet(dbCommand))
        //        {
        //            if (ds != null && ds.Tables.Count > 0)
        //            {
        //                foreach (DataRow dr in ds.Tables[0].Rows)
        //                {
        //                    departments.Add(new Departments
        //                    {
        //                        DepartmentCode = dr["DepartmentCode"].ToString(),
        //                        DepartmentName = dr["DepartmentName"].ToString()
        //                    });
        //                }
        //            }
        //        }
        //        return departments;
        //    }
        //    catch (Exception) { throw; }
        //}
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}
