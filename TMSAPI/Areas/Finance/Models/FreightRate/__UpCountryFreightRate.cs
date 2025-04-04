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
    public class __UpCountryFreightRate
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     

        public int? DetailId { get; set; }
        public string EffectiveDate { get; set; }
        public double? Plain0To77 { get; set; }
        public double? Plain78To560 { get; set; }
        public double? PlainMoreThan560 { get; set; }
        public double? Hilly { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor

        public __UpCountryFreightRate()
        {
        }

        public __UpCountryFreightRate(int _detailId, string _EffectiveDate, double _Plain0To77, double _Plain78To560, double _PlainMoreThan560,
            double _Hilly)
        {
            DetailId = _detailId;
            EffectiveDate = _EffectiveDate;
            Plain0To77 = _Plain0To77;
            Plain78To560 = _Plain78To560;
            PlainMoreThan560 = _PlainMoreThan560;
            Hilly = _Hilly;
            Add = false;
        }
        #endregion

        #region internal methods
        internal static List<__UpCountryFreightRate> Get(short _companyid)
        {
            List<__UpCountryFreightRate> documents = new List<__UpCountryFreightRate>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetUpCountryFreightRates"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, _companyid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            documents.Add(new __UpCountryFreightRate(
                                Convert.ToInt32(dr["DetailId"]),
                                    dr["EffectiveDate"].ToString(),
                                    Convert.ToDouble(dr["Plain0To77"]),
                                    Convert.ToDouble(dr["Plain78To560"]),
                                    Convert.ToDouble(dr["PlainMoreThan560"]),
                                    Convert.ToDouble(dr["Hilly"])));
                        }
                    }
                }
            }
            return documents;
        }

        internal static bool Save(List<__UpCountryFreightRate> _details, short _companyid, string _userId, DbTransaction _transaction)
        {
            try
            {
                foreach (__UpCountryFreightRate _doc in agHelper.GetChanges(_details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveUpCountryFreightRate"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.VarChar, _doc.DetailId);
                        db.AddInParameter(dbCommand, "EffectiveDate", SqlDbType.DateTime, DateTime.ParseExact(_doc.EffectiveDate, "dd/MM/yyyy", CultureInfo.CurrentCulture));
                        db.AddInParameter(dbCommand, "Plain0To77", SqlDbType.SmallInt, _doc.Plain0To77);
                        db.AddInParameter(dbCommand, "Plain78To560", SqlDbType.SmallInt, _doc.Plain78To560);
                        db.AddInParameter(dbCommand, "PlainMoreThan560", SqlDbType.SmallInt, _doc.PlainMoreThan560);
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
