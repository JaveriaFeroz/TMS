using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsTypeDoc
    {
        #region private properties
         private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public short DocTypeId { get; set; }
        public bool Mandatory { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InsTypeDoc()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsTypeDoc> Get(short typeId)
        {
            List<InsTypeDoc> docs = new List<InsTypeDoc>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsTypeDocsById"))
            {
                db.AddInParameter(dbCommand, "TypeId", SqlDbType.TinyInt, typeId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            docs.Add(new InsTypeDoc
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                DocTypeId = Convert.ToInt16(dr["DocTypeId"]),
                                Mandatory = Convert.ToBoolean(dr["Mandatory"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return docs;
        }

        internal static bool Save(short typeId, List<InsTypeDoc> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (InsTypeDoc itd in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsTypeDoc"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, itd.DetailId);
                        db.AddInParameter(dbCommand, "DocTypeId", SqlDbType.SmallInt, itd.DocTypeId);
                        db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, typeId);
                        db.AddInParameter(dbCommand, "Mandatory", SqlDbType.Bit, itd.Mandatory);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                            itd.Delete ? "D" : (itd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);                        
                    }
                }
            }
            catch(Exception) { throw; }
            return true;
        }
        #endregion
    }
}