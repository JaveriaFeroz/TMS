using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class Period : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        //public int CurrentYear { get; set; }
        #endregion

        #region constructor
        public Period()
        {
        }
        #endregion

        #region internal methods
        internal static Period Get(short companyId, short periodTypeId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCurrentPeriod"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "PeriodTypeId", SqlDbType.TinyInt, periodTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Period
                        {
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString()
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static List<Period> GetOpenPeriods(short companyId, agEnums.PeriodType periodTypeId)
        {
            List<Period> periods = new List<Period>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetOpenPeriods"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "PeriodTypeId", SqlDbType.TinyInt, periodTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            periods.Add(new Period
                            {
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString()
                            });
                        }
                    }
                    return periods;
                }
            }
        }

        internal static List<Period> GetPeriods(short companyId, agEnums.PeriodType periodTypeId)
        {
            List<Period> periods = new List<Period>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPeriods"))
            {
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                db.AddInParameter(dbCommand, "PeriodTypeId", SqlDbType.TinyInt, periodTypeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            periods.Add(new Period
                            {
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString()
                            });
                        }
                    }
                    return periods;
                }
            }
        }

        internal static Period Close(short companyId, short periodTypeId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("CloseCurrentPeriod"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "PeriodTypeId", SqlDbType.TinyInt, periodTypeId);
                    db.ExecuteNonQuery(dbCommand);
                    return Get(companyId, periodTypeId);
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
        }
        #endregion
    }
}