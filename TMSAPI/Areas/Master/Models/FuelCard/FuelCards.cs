using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    public class FuelCards : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short CardId { get; set; }
        [DataMember(Order = 1)]
        public string  CardNo { get; set; }
        [DataMember(Order = 2)]
        public string SupplierName { get; set; }
        [DataMember(Order = 3)]
        public string ClientName { get; set; }
        [DataMember(Order = 4)]
        public short SupplierId { get; set; }
        [DataMember(Order = 5)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public FuelCards()
        {
        }
        #endregion

        #region internal methods
        internal static List<FuelCards> Get(short companyId,  string UserId, bool _activeOnly = true)
        {
            List<FuelCards> cards = new List<FuelCards>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelCards"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, UserId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            cards.Add(new FuelCards
                            {
                                CardId = Convert.ToInt16(dr["CardId"]),
                                CardNo = dr["CardNo"].ToString(),
                                SupplierName = dr["SupplierName"].ToString(),
                                ClientName = dr["ClientName"].ToString(),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return cards;
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