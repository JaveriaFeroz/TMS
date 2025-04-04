using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace TMSAPI.Areas.Master.Models
{
    [DataContract]
    public class ProductNatures 
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        [DataMember(Order = 0)]
        public short NatureId { get; set; }
        [DataMember(Order = 1)]
        public string NatureName { get; set; }
        [DataMember(Order = 2)]
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public ProductNatures()
        {
        }
        #endregion

        #region internal methods
        internal static List<ProductNatures> Get(bool _activeOnly = true)
        {
            List<ProductNatures> natures = new List<ProductNatures>();
            DbCommand dbCommand = db.GetStoredProcCommand("GetProductNatures");
            db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, _activeOnly);
            using (DataSet ds = db.ExecuteDataSet(dbCommand))
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        natures.Add(new ProductNatures
                        {
                            NatureId = Convert.ToInt16(dr["ProductNatureId"]),
                            NatureName = dr["ProductNatureName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"])
                        });
                    }
                }
            }
            return natures;
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
