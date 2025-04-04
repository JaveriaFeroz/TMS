using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    //this class will be further worked upon later
    public class Clients
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties   
        //public short FormId { get; set; }
        //public string StateId { get; set; }
        public short ClientId { get; set; }      
        public string ClientName { get; set; }
        public bool CategoryMandatory { get; set; }
        public bool ProductMandatory { get; set; }
        public short DetGraceHRs { get; set; }
        public short? RateTypeId { get; set; }
        public short PaymentModeId { get; set; }
        public double TaxRate { get; set; }
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public Clients()
        {
        }
        #endregion

        #region internal methods
        internal static List<Clients> Get(short companyId, string userId, bool activeOnly = true)
        {
            try
            {
                List<Clients> clients = new List<Clients>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetClients"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.TinyInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                clients.Add(new Clients
                                {
                                    ClientId = Convert.ToInt16(dr["ClientId"]),
                                    ClientName = dr["ClientName"].ToString(),
                                    IsActive = Convert.ToBoolean(dr["IsActive"]),
                                    TaxRate = Convert.ToDouble(dr["TaxRate"])
                                });
                            }
                        }
                    }
                }
                return clients;
            }
            catch (Exception) { throw; }
        }

        internal static List<Clients> GetForRWB(short companyId, string userId, bool _activeOnly = true)
        {
            try
            {
                List<Clients> clients = new List<Clients>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetClientForRWB"))
                {
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                clients.Add(new Clients
                                {
                                    ClientId = Convert.ToInt16(dr["ClientId"]),
                                    ClientName = dr["ClientName"].ToString(),
                                    CategoryMandatory = Convert.ToBoolean(dr["CategoryMandatory"]),
                                    ProductMandatory = Convert.ToBoolean(dr["ProductMandatory"]),
                                    DetGraceHRs = Convert.ToInt16(dr["DetGraceHRs"]),
                                    RateTypeId = agHelper.sDBNull(dr["RateTypeId"]),
                                    PaymentModeId = Convert.ToInt16(dr["PaymentModeId"])
                                });
                            }
                        }
                    }
                }
                return clients;
            }
            catch (Exception) { throw; }
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
