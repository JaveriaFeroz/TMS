using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Linq;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class __LocalFreightRate
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     

        public int? DetailId { get; set; }
        public DateTime? DateFrom { get; set; }
        public double? Rate0To64 { get; set; }
        public double? Plain65To1980 { get; set; }
        public double? PlainMoreThan1980 { get; set; }
        public double? Hilly { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor

        public __LocalFreightRate()
        {
        }

        public __LocalFreightRate(int _detailId, string _EffectiveDate, double _Plain0To64, double _Plain65To1980, double _PlainMoreThan1980, 
            double _Hilly)
        {
            DetailId = _detailId;
            DateFrom = _EffectiveDate;
            Plain0To64 = _Plain0To64;
            Plain65To1980 = _Plain65To1980;
            PlainMoreThan1980 = _PlainMoreThan1980;
            Hilly = _Hilly;
            Add = false;
        }
        #endregion

        #region internal methods
        internal static List<__LocalFreightRate> Get(short _companyid)
        {
            List<__LocalFreightRate> documents = new List<__LocalFreightRate>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSimpleFreightRates"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, _companyid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            documents.Add(new __LocalFreightRate(
                                Convert.ToInt32(dr["DetailId"]),
                                    dr["EffectiveDate"].ToString(),                                 
                                    Convert.ToDouble(dr["Plain0To64"]),
                                    Convert.ToDouble(dr["Plain65To1980"]),
                                    Convert.ToDouble(dr["PlainMoreThan1980"]),
                                    Convert.ToDouble(dr["Hilly"])));
                        }
                    }
                }
            }
            return documents;
        }

        internal static bool Save(List<__LocalFreightRate> _details, short _companyid, string _userId,  DbTransaction _transaction)
        {
            try
            {
                foreach (__LocalFreightRate _doc in agHelper.GetChanges(_details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSimpleFreightRate"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.VarChar, _doc.DetailId);
                        db.AddInParameter(dbCommand, "EffectiveDate", SqlDbType.DateTime, DateTime.ParseExact(_doc.DateFrom, "dd/MM/yyyy", CultureInfo.CurrentCulture));
                        db.AddInParameter(dbCommand, "Plain0To64", SqlDbType.SmallInt, _doc.Plain0To64);
                        db.AddInParameter(dbCommand, "Plain65To1980", SqlDbType.SmallInt, _doc.Plain65To1980);
                        db.AddInParameter(dbCommand, "PlainMoreThan1980", SqlDbType.SmallInt, _doc.PlainMoreThan1980);
                        db.AddInParameter(dbCommand, "Hilly", SqlDbType.SmallInt, _doc.Hilly);
                        db.AddInParameter(dbCommand, "Companyid", SqlDbType.SmallInt, _companyid);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                           _doc.Delete ? "D" : (_doc.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, _transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }
        #endregion
    }
}
