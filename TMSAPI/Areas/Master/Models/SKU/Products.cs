using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class FMProducts
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public int ProductId { get; set; }
        [DataMember(Order = 1)]
        public string ProductName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
       // [(Browsable == false)]
        public short ClientId { get; set; }
        #endregion

        #region constructor
        public FMProducts()
        {
        }

        public FMProducts(int _ProductId, string _ProductName, bool isActive)
        {
            ProductId = _ProductId;
            ProductName = _ProductName;
            IsActive = isActive;
        }

        public FMProducts(int _ProductId, string _ProductName, short _ClientId)
        {
            ProductId = _ProductId;
            ProductName = _ProductName;
            ClientId = _ClientId;
        }


        #endregion

        #region internal methods
        internal static List<FMProducts> Get(bool _activeOnly = true)
        {
            List<FMProducts> lstP = new List<FMProducts>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFMProducts"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstP.Add(new FMProducts(Convert.ToInt32(dr["ProductId"]),
                                          dr["ProductName"].ToString(),
                                          Convert.ToBoolean(dr["IsActive"])));
                        }
                    }
                }
                return lstP;
            }
        }

        internal static List<FMProducts> GetProductWithClients()
        {
            List<FMProducts> lstP = new List<FMProducts>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetProductWithClient"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstP.Add(new FMProducts(Convert.ToInt32(dr["ProductId"]),
                                          dr["ProductName"].ToString(),
                                          Convert.ToInt16(dr["ClientId"])));
                        }
                    }
                }
            }
            return lstP;
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