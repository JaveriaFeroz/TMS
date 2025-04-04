using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Common.Models
{
    [DataContract]
    public class MaintHistory : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string WONo { get; set; }
        public DateTime WODate { get; set; }
        public int? RequestId { get; set; }
        public string WOTypeName { get; set; }
        public string StateName { get; set; }
        public string CreatedBy { get; set; }
        public double KMsReading { get; set; }
        public decimal? Estimates { get; set; }
        public string ActivityDetail { get; set; }
        #endregion

        #region constructor
        public MaintHistory()
        { }
        #endregion

        #region internal methods
        internal static List<MaintHistory> Get(int assetId, string userId)
        {
            List<MaintHistory> histories = new List<MaintHistory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetMaintHistory"))
            {
                db.AddInParameter(dbCommand, "AssetId", SqlDbType.Int, assetId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            histories.Add(new MaintHistory
                            {
                                WONo = dr["WONo"].ToString(),
                                WODate = Convert.ToDateTime(dr["WoDate"]),
                                RequestId = agHelper.iDBNull(dr["RequestId"]),
                                WOTypeName = dr["TypeName"].ToString(),
                                StateName = dr["StateName"].ToString(),
                                CreatedBy = dr["CreatedBy"].ToString(),
                                KMsReading = Convert.ToDouble(dr["KMsReading"]),
                                Estimates = Convert.ToDecimal(dr["EstTotal"]),
                                ActivityDetail = dr["ActivityDetail"].ToString()
                            });
                        }
                    }
                }
            }
            return histories;
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