using Microsoft.AspNetCore.Http;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Master.Models
{
    public class DriverDocument : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DetailId { get; set; }
        public int? DriverId { get; set; }
        public int? TypeId { get; set; }
        public string TypeName { get; set; }
        public string FileName { get; set; }
        public byte[] FileContent { get; set; }
        public string ContentType { get; set; }
        public bool IsNew { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        //only used to temporary hold stream during upload
        public IFormFile Image { get; set; }
        #endregion

        #region constructor
        public DriverDocument()
        {
        }
        #endregion

        #region internal methods
        internal static List<DriverDocument> Get(int claimId)
        {
            List<DriverDocument> documents = new List<DriverDocument>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverDocumentsById"))
            {
                db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, claimId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            documents.Add(new DriverDocument
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                DriverId = Convert.ToInt32(dr["DriverId"]),
                                TypeId = Convert.ToInt32(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString(),
                                FileName = dr["FileName"].ToString()
                            });
                        }
                    }
                }
            }
            return documents;
        }

        internal static bool Delete(int driverid, List<DriverDocument> _details, string userId, DbTransaction _transaction)
        {
            try
            {
                foreach (DriverDocument _icd in _details.Where(x => x.IsDeleted))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("DeleteDriverDocument"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, _icd.DetailId);
                        db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverid);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, _transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }

        internal static bool Upload(DriverDocument icd, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriverDocument"))
                {
                    db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, icd.DetailId);
                    db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, icd.DriverId);
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

        internal static DriverDocument GetStream(int documentId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverDocumentStreamById"))
            {
                db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, documentId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new DriverDocument
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