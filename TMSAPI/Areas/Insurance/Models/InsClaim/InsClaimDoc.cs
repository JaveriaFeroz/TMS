using Microsoft.AspNetCore.Http;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsClaimDoc : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? ClaimId { get; set; }
        public int? TypeId { get; set; }
        public string TypeName { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] FileContent { get; set; }
        //public bool IsNew { get; set; } = true;
        public bool Delete { get; set; } = false;
        //only used to hold image stream during upload
        public IFormFile Image { get; set; }
        #endregion

        #region constructor
        public InsClaimDoc()
        {
        }
        #endregion

        #region internal methods
        internal static List<InsClaimDoc> Get(int claimId)
        {
            List<InsClaimDoc> docs = new List<InsClaimDoc>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsClaimDocsById"))
            {
                db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            docs.Add(new InsClaimDoc
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ClaimId = Convert.ToInt32(dr["ClaimId"]),
                                TypeId = Convert.ToInt32(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString(),
                                FileName = dr["FileName"].ToString()
                            });
                        }
                    }
                }
            }
            return docs;
        }

        internal static bool Remove(int claimId, List<InsClaimDoc> details, string userId, DbTransaction _transaction)
        {
            try
            {
                foreach (InsClaimDoc icd in details.Where(x => x.Delete))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("DeleteInsClaimDocument"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, icd.DetailId);
                        db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, claimId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, _transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Upload(InsClaimDoc icd, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsClaimDocument"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, icd.DetailId);
                    db.AddInParameter(dbCommand, "ClaimId", SqlDbType.Int, icd.ClaimId);
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.Int, icd.TypeId);
                    db.AddInParameter(dbCommand, "FileName", SqlDbType.VarChar, icd.FileName);
                    db.AddInParameter(dbCommand, "ContentType", SqlDbType.VarChar, icd.ContentType);
                    db.AddInParameter(dbCommand, "FileContent", SqlDbType.VarBinary, icd.FileContent);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }

        internal static InsClaimDoc GetStream(int documentId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsClaimDocStreamById"))
            {
                db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, documentId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InsClaimDoc
                        {
                            FileName = dr["FileName"].ToString(),
                            ContentType = dr["ContentType"].ToString(),
                            FileContent = (byte[])(dr["FileContent"])
                        };
                    }
                    else
                        return null;
                }
            }
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
