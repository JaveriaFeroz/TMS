using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Insurance.Models
{
    public class InsType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsActive { get; set; }
        public List<InsTypeDoc> Docs { get; set; } = new List<InsTypeDoc>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InsType()
        {
        }
        #endregion

        #region internal methods
        internal static InsType Get(short typeId, short companyId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInsTypeById"))
            {
                db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, typeId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InsType
                        {
                            TypeId = Convert.ToInt16(dr["TypeId"]),
                            TypeName = dr["TypeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Docs = InsTypeDoc.Get(typeId),
                            Footer = new agFooter(dr),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InsType it, short companyId, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInsType"))
                {
                    db.AddInParameter(dbCommand, "TypeId", SqlDbType.SmallInt, it.TypeId);
                    db.AddInParameter(dbCommand, "TypeName", SqlDbType.VarChar, it.TypeName);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, it.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, it.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newTypeId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    it.TypeId = Convert.ToInt16(dbCommand.Parameters["@newTypeId"].Value);
                    InsTypeDoc.Save(it.TypeId.Value, it.Docs, userId, transaction);
                    transaction.Commit();
                }
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
            return true;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}