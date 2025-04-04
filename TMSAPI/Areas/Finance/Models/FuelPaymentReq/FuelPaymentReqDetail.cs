using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Finance.Models
{
    public class FuelPaymentReqDetail
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public bool Selected { get; set; }
        //public int? DetailId { get; set; }
        public int JobId { get; set; }
        public string JobNo { get; set; }
        public int SlipId { get; set; }
        public string SlipNo { get; set; }
        public string SlipDate { get; set; }
        public bool Genset { get; set; } = false;
        public string AssetNo { get; set; }       
        public double Litre { get; set; }
        public double Amount { get; set; }     
        #endregion

        #region constructor
        public FuelPaymentReqDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<FuelPaymentReqDetail> Get(short requestId)
        {
            List<FuelPaymentReqDetail> details = new List<FuelPaymentReqDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelPaymentDetailById"))
            {
                db.AddInParameter(dbCommand, "RequestId", SqlDbType.SmallInt, requestId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new FuelPaymentReqDetail
                            {
                                //DetailId = Convert.ToInt32(dr["DetailId"]),
                                JobId = Convert.ToInt32(dr["JobId"]),
                                JobNo = dr["JobNo"].ToString(),
                                SlipId = Convert.ToInt32(dr["SlipId"]),
                                SlipNo = dr["SlipNo"].ToString(),
                                SlipDate = dr["SlipDate"].ToString(),
                                //FuelTypeId = Convert.ToInt16(dr["FuelTypeId"]),
                                Genset = Convert.ToBoolean(dr["Genset"]),
                                AssetNo = dr["AssetNo"].ToString(),
                                Litre = Convert.ToDouble(dr["Qty"]),
                                Amount = Convert.ToDouble(dr["Amount"])//,
                                //Selected = Convert.ToBoolean(dr["Paid"])
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static List<FuelPaymentReqDetail> GetForCard(short cardId, DateTime dtFrom, DateTime dtTo, 
            short companyId, string userId)
        {
            try
            {
                List<FuelPaymentReqDetail> details = new List<FuelPaymentReqDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelSlipsPendingByCardId"))
                {
                    db.AddInParameter(dbCommand, "CardId", SqlDbType.SmallInt, cardId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, dtFrom);
                    db.AddInParameter(dbCommand, "ToDate", SqlDbType.DateTime, dtTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new FuelPaymentReqDetail
                                {
                                    //DetailId = Convert.ToInt32(dr["DetailId"]),
                                    JobId = Convert.ToInt32(dr["JobId"]),
                                    JobNo = dr["JobNo"].ToString(),
                                    SlipId = Convert.ToInt32(dr["SlipId"]),
                                    SlipNo = dr["SlipNo"].ToString(),
                                    SlipDate = dr["SlipDate"].ToString(),//Convert.ToDateTime(dr["SlipDate"]),
                                    Genset = Convert.ToBoolean(dr["Genset"]),
                                    AssetNo = dr["AssetNo"].ToString(),
                                    Litre = Convert.ToDouble(dr["Qty"]),
                                    Amount = Convert.ToDouble(dr["Amount"])//,
                                                                           //Selected = Convert.ToBoolean(dr["Paid"])
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception ex) { throw ex; }
        }

        internal static List<FuelPaymentReqDetail> GetForSupplier(short supplierId, DateTime dtFrom, DateTime dtTo, 
            short companyId, string userId)
        {
            try
            {
                List<FuelPaymentReqDetail> details = new List<FuelPaymentReqDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetFuelSlipsPendingBySupplierId"))
                {
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.VarChar, supplierId);
                    db.AddInParameter(dbCommand, "FromDate", SqlDbType.DateTime, dtFrom);
                    db.AddInParameter(dbCommand, "ToDate", SqlDbType.DateTime, dtTo);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new FuelPaymentReqDetail
                                {
                                    //DetailId = Convert.ToInt32(dr["DetailId"]),
                                    JobId = Convert.ToInt32(dr["JobId"]),
                                    JobNo = dr["JobNo"].ToString(),
                                    SlipId = Convert.ToInt32(dr["SlipId"]),
                                    SlipNo = dr["SlipNo"].ToString(),
                                    SlipDate = dr["SlipDate"].ToString(),//Convert.ToDateTime(dr["SlipDate"]),
                                                                         //FuelTypeId = Convert.ToInt16(dr["FuelTypeId"]),
                                    Genset = Convert.ToBoolean(dr["Genset"]),
                                    AssetNo = dr["AssetNo"].ToString(),
                                    Litre = Convert.ToDouble(dr["Qty"]),
                                    Amount = Convert.ToDouble(dr["Amount"])//,
                                                                           //Selected = Convert.ToBoolean(dr["Paid"])
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int requestId, List<FuelPaymentReqDetail> details, DbTransaction transaction)
        {            
            foreach (FuelPaymentReqDetail fpd in details)//agHelper.GetChanges(details))
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveFuelPaymentDetail"))
                {                   
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                    db.AddInParameter(dbCommand, "SlipId", SqlDbType.VarChar, fpd.SlipId);
                    //db.AddInParameter(dbCommand, "IsVehicle", SqlDbType.Float, fpd.IsVehicle);
                    //db.AddInParameter(dbCommand, "Paid", SqlDbType.Bit, fpd.Selected);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            return true;
        }
        #endregion
    }
}
