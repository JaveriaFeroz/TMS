using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Insurance.Models
{
    public class ___InsPolicyDept : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public string DepartmentCode { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region Public constructor
        public ___InsPolicyDept()
        {
            DetailId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public ___InsPolicyDept(int _detailId, string _departmentid )
        {
            DetailId = _detailId;
            DepartmentCode = _departmentid;
            Add = false; Edit = false; Delete = false;
        }     
        #endregion        

        #region internal methods
        internal static List<___InsPolicyDept> Get(int ipid)
        {
            List<___InsPolicyDept> lPA = new List<___InsPolicyDept>();

            using (DbCommand dbCommand = db.GetStoredProcCommand("getInsurancePolicyDepartmentById"))
            {
                db.AddInParameter(dbCommand, "IPID", SqlDbType.Int, ipid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ___InsPolicyDept ipa = new ___InsPolicyDept(
                                Convert.ToInt32(dr["DetailId"]),
                               dr["DepartmentCode"].ToString());
                            lPA.Add(ipa);
                        }
                    }
                }
            }
            return lPA;
        }

        internal static bool SaveInsurancePolicyDepartment(short? ipid, List<___InsPolicyDept> details, string userId, DbTransaction transaction)
        {
            
            foreach (___InsPolicyDept ipa in getIPDepartmentChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsurancePolicyDepartment"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.BigInt, ipa.DetailId);
                    db.AddInParameter(dbCommand, "PolicyId", SqlDbType.SmallInt, ipid);
                    db.AddInParameter(dbCommand, "DepartmentCode", SqlDbType.VarChar, ipa.DepartmentCode);

                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                        ipa.Delete ? "D" : (ipa.Add ? "I" : "U")));
                    
                    db.ExecuteNonQuery(dbCommand, transaction);

                }
            }
            return true;
        }
        #endregion

        #region private method
        private static IEnumerable<___InsPolicyDept> getIPDepartmentChanges(List<___InsPolicyDept> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}
