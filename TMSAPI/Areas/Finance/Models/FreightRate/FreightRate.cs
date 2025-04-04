using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class FreightRate : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties      
        //public List<LocalFreightRate> SDetails { get; set; }
        //public List<UpCountryFreightRate> UDetails { get; set; }
        public double? LocalRate0To64 { get; set; }
        public double? LocalRate65To1980 { get; set; }
        public double? LocalRateAbove1980 { get; set; }
        public double? LocalRateHilly { get; set; }
        public double? UpCountryRate0To77 { get; set; }
        public double? UpCountryRate78To560 { get; set; }
        public double? UpCountryRateAbove560 { get; set; }
        public double? UpCountryHilly { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public FreightRate()
        {
        }
        #endregion

        #region internal methods
        internal static FreightRate Get(short companyId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetFreightRate"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new FreightRate
                            {
                                LocalRate0To64 = Convert.ToDouble(dr["Local0To64"]),
                                LocalRate65To1980 = Convert.ToDouble(dr["Local65To1980"]),
                                LocalRateAbove1980 = Convert.ToDouble(dr["LocalAbove1980"]),
                                LocalRateHilly = Convert.ToDouble(dr["LocalHilly"]),
                                UpCountryRate0To77 = Convert.ToDouble(dr["UpCountry0To77"]),
                                UpCountryRate78To560 = Convert.ToDouble(dr["UpCountry78To560"]),
                                UpCountryRateAbove560 = Convert.ToDouble(dr["UpCountryAbove560"]),
                                UpCountryHilly = Convert.ToDouble(dr["UpCountryHilly"]),
                                Footer = new agFooter(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Save(FreightRate fr, short companyId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFreightRate"))
                {
                    db.AddInParameter(dbCommand, "LocalRate0To64", SqlDbType.Decimal, fr.LocalRate0To64);
                    db.AddInParameter(dbCommand, "LocalRate65To1980", SqlDbType.Decimal, fr.LocalRate65To1980);
                    db.AddInParameter(dbCommand, "LocalRateAbove1980", SqlDbType.Decimal, fr.LocalRateAbove1980);
                    db.AddInParameter(dbCommand, "LocalRateHilly", SqlDbType.Decimal, fr.LocalRateHilly);
                    db.AddInParameter(dbCommand, "UpCountryRate0To77", SqlDbType.Decimal, fr.UpCountryRate0To77);
                    db.AddInParameter(dbCommand, "UpCountryRate78To560", SqlDbType.Decimal, fr.UpCountryRate78To560);
                    db.AddInParameter(dbCommand, "UpCountryRateAbove560", SqlDbType.Decimal, fr.UpCountryRateAbove560);
                    db.AddInParameter(dbCommand, "UpCountryHilly", SqlDbType.Decimal, fr.UpCountryHilly);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}