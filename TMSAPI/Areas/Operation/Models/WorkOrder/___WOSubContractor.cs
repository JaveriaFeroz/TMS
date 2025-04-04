using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace TMSAPI.Areas.Operation.Models
{
    public class ___WOSubContractor
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? SubContractId { get; set; }
        public short SubContractorId { get; set; }
        public double Amount { get; set; }
        public string Narration { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        #endregion

        #region constructor
        public ___WOSubContractor()
        {
            Add = true; Edit = false; Delete = false;
        }

        public ___WOSubContractor(int subContractId, short subContractorId, double amount, string narration)
        {
            SubContractId = subContractId;
            SubContractorId = subContractorId;
            Amount = amount;
            Narration = narration;
            Add = false; Edit = false; Delete = false;
        }
        #endregion

        #region internal methods
        internal static List<___WOSubContractor> Get(int _woNo)
        {
            List<___WOSubContractor> lstSC = new List<___WOSubContractor>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getWOActualSubContractorByNo"))
            {
                db.AddInParameter(dbCommand, "WorkOrderNo", SqlDbType.VarChar, _woNo);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstSC.Add(new ___WOSubContractor(
                                Convert.ToInt32(dr["SubContractId"]),
                                Convert.ToInt16(dr["SubcontractorId"]),
                                Convert.ToDouble(dr["Amount"]),
                                dr["Narration"].ToString()));
                        }
                    }
                }
            }
            return lstSC;
        }

        internal static bool Save(int? _woNo, List<___WOSubContractor> _details, string userId, DbTransaction transaction)
        {
           try
            {
                foreach (___WOSubContractor _sc in getWorkOrderSCChanges(_details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWorkOrderActualSubContract"))
                    {
                        db.AddInParameter(dbCommand, "SubContractId", SqlDbType.Int, _sc.SubContractId);
                        db.AddInParameter(dbCommand, "WONo", SqlDbType.Int, _woNo);
                        db.AddInParameter(dbCommand, "SubContractorId", SqlDbType.SmallInt, _sc.SubContractorId);
                        db.AddInParameter(dbCommand, "Amount", SqlDbType.Float, _sc.Amount);
                        db.AddInParameter(dbCommand, "Narration", SqlDbType.VarChar, _sc.Narration);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                             _sc.Delete ? "D" : (_sc.Add ? "I" : "U")));
                        db.AddOutParameter(dbCommand, "newSubContractId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        _sc.SubContractId = Convert.ToInt32(dbCommand.Parameters["@newSubContractId"].Value);
                    }
                }
                return true;
            }
            catch(Exception) { throw; }
        }
        #endregion

        #region private methods
        private static IEnumerable<___WOSubContractor> getWorkOrderSCChanges(List<___WOSubContractor> _details)
        {
            return (_details.Where(x => x.Add || x.Edit || x.Delete));
        }
        #endregion
    }
}