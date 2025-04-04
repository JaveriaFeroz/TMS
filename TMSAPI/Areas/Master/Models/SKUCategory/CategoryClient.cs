using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class CategoryClient
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short ClientId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CategoryClient()
        {
        }
        #endregion

        #region internal methods
        internal static List<CategoryClient> Get(short categoryId)
        {
            List<CategoryClient> clients = new List<CategoryClient>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSKUCategoryClientsById"))
            {
                db.AddInParameter(dbCommand, "CategoryId", SqlDbType.SmallInt, categoryId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            clients.Add(new CategoryClient
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ClientId = Convert.ToInt16(dr["ClientId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return clients;
        }

        internal static bool Save(short? categoryid, List<CategoryClient> details, string userId, DbTransaction transaction)
        {
            foreach (CategoryClient cc in agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSKUCategoryClient"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, cc.DetailId);
                    db.AddInParameter(dbCommand, "CategoryId", SqlDbType.SmallInt, categoryid);
                    db.AddInParameter(dbCommand, "ClientId", SqlDbType.SmallInt, cc.ClientId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                               cc.Delete ? "D" : (cc.Add ? "I" : "U")));
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}