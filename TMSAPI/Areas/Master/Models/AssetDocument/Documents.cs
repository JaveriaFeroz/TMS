using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models.AD
{
    public class Documents
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public short? TypeId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public Documents()
        {
        }
        #endregion

        #region internal methods
        internal static List<Documents> Get(short assetid, short companyId)
        {
            List<Documents> documents = new List<Documents>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAssetDocumentsById"))
            {
                db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetid);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            documents.Add(new Documents
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                IssueDate = Convert.ToDateTime(dr["IssueDate"]),
                                ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]),
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return documents;
        }

        internal static bool Save(short? assetId, List<Documents> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (Documents _doc in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAssetDocument"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, _doc.DetailId);
                        db.AddInParameter(dbCommand, "AssetId", SqlDbType.SmallInt, assetId);
                        db.AddInParameter(dbCommand, "IssueDate", SqlDbType.DateTime, _doc.IssueDate);
                        db.AddInParameter(dbCommand, "ExpiryDate", SqlDbType.DateTime, _doc.ExpiryDate);
                        db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, _doc.TypeId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                           _doc.Delete ? "D" : (_doc.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
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