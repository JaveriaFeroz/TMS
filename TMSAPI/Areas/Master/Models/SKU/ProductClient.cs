using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Master.Models
{
    public class FMProductClient
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ClientId { get; set; }     
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region constructor
        public FMProductClient()
        {
            DetailId = -1;
            Add = true; Edit = false; Delete = false;
        }

        public FMProductClient(int _detailId, short _ClientId)
        {
            DetailId = _detailId;
            ClientId = _ClientId;
            Add = false; Edit = false; Delete = false;
        }
        #endregion

        #region internal methods
        internal static List<FMProductClient> Get(short productid)
        {
            List<FMProductClient> lstAD = new List<FMProductClient>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientsbyFMProductId"))
            {
                db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, productid);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstAD.Add(new FMProductClient(
                                Convert.ToInt32(dr["DetailId"]),                                
                                    Convert.ToInt16(dr["ClientId"])));
                        }
                    }
                }
            }
            return lstAD;
        }

        internal static bool Save(short? productid, List<FMProductClient> details, string userId, DbTransaction transaction)
        {
            
            foreach (FMProductClient ges in getGESDetailChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFMProductClient"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.BigInt, ges.DetailId);
                    db.AddInParameter(dbCommand, "ProductId", SqlDbType.SmallInt, productid);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, ges.ClientId);

                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               ges.Delete ? "D" : (ges.Add ? "I" : "U")));

                    db.ExecuteNonQuery(dbCommand, transaction);

                }
            }
            return true;
        }
        #endregion

        #region private methods
        private static IEnumerable<FMProductClient> getGESDetailChanges(List<FMProductClient> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}