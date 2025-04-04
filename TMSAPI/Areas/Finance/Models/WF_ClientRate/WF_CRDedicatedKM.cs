using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Finance.Models
{
    public class WF_CRDedicatedKM
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? CDetailId { get; set; }
        //public short? ConsigneeId { get; set; }       
        public short? RouteId { get; set; }
        public short? RouteGroupId { get; set; }
        public double Distance { get; set; }
        //public double LoadingCharges { get; set; }
        //public double OffloadingCharges { get; set; }        
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_CRDedicatedKM()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_CRDedicatedKM> Get(short formId)
        {
            List<WF_CRDedicatedKM> kms = new List<WF_CRDedicatedKM>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_ClientRate_DedicatedKM"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            kms.Add(new WF_CRDedicatedKM
                            {
                                CDetailId = Convert.ToInt32(dr["CDetailId"]),
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                RouteId = Convert.ToInt16(dr["RouteId"]),
                                RouteGroupId = agHelper.sDBNull(dr["RouteGroupId"]),
                                Distance = Convert.ToDouble(dr["Distance"]),
                                //Convert.ToDouble(dr["LoadingCharges"]),
                                //  Convert.ToDouble(dr["OffloadingCharges"])
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return kms;
        }

        internal static bool Save(int _formId, List<WF_CRDedicatedKM> details, string userId, DbTransaction transaction)
        {
            foreach (WF_CRDedicatedKM crkm in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_ClientRate_DedicatedKM"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, _formId);
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, crkm.DetailId);
                    db.AddInParameter(dbCommand, "CDetailId", SqlDbType.Int, crkm.CDetailId);
                    db.AddInParameter(dbCommand, "RouteId", SqlDbType.SmallInt, crkm.RouteId);
                    db.AddInParameter(dbCommand, "RouteGroupId", SqlDbType.SmallInt, crkm.RouteGroupId);
                    db.AddInParameter(dbCommand, "Distance", SqlDbType.Float, crkm.Distance);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          crkm.Delete ? "D" : (crkm.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
