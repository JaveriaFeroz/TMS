using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class Cheque
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ChqId { get; set; }
        public string ChqNo { get; set; }
        #endregion

        #region constructor
        public Cheque()
        {
        }
        #endregion

        #region internal methods
        internal static Cheque GetNext(short _cbId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetNextCheque"))
            {
                db.AddInParameter(dbCommand, "CBId", SqlDbType.SmallInt, _cbId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Cheque
                        {
                            ChqId = Convert.ToInt32(dr["ChqId"]),
                            ChqNo = dr["ChqNo"].ToString(),
                        };
                    }
                    else
                        return null;
                }
            }
        }
        #endregion
    }
}