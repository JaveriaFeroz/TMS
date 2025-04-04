using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Common.Models
{
    public class Recipient
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string RecipientId { get; set; }
        public string RecipientName { get; set; }
        //public List<Recipient> Recipients { get; set; }
        #endregion

        #region constructor
        public Recipient()
        {
        }

        public Recipient(string recipientId, string recipientName)
        {
            RecipientId = recipientId;
            RecipientName = recipientName;
        }
        #endregion

        #region internal methods
        internal static List<Recipient> Get(short _workflowId, short companyId, int _stateid)
        {
            List<Recipient> recipients = new List<Recipient>();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRecipients"))
                {
                    db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, _workflowId);
                    db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                    db.AddInParameter(dbCommand, "StateId", SqlDbType.SmallInt, _stateid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                recipients.Add(new Recipient(dr["UserId"].ToString(),
                                   dr["UserName"].ToString()));
                            }
                        }
                    }

                    //using (IDataReader dr = db.ExecuteReader(dbCommandDetail))
                    //{
                    //    dr.Read();
                    //    lr.Add(new Recipient(
                    //        dr.GetString(dr.GetOrdinal("UserId")),
                    //        dr.GetString(dr.GetOrdinal("UserName"))));
                    //    return lr;
                    //}
                }
                return recipients;
            }
            catch (Exception)
            { throw; }
        }

        internal static List<Recipient> GetWORecipients(int woId, short stateId, out short nextStateId)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                nextStateId = stateId;
                DbCommand dbCommandDetail = db.GetStoredProcCommand("GetWorkOrderRecipients");
                db.AddInParameter(dbCommandDetail, "WOId", SqlDbType.Int, woId);
                //db.AddInParameter(dbCommandDetail, "WorkOrderCategory", SqlDbType.SmallInt, DocumentTypeId);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, stateId);
                db.AddOutParameter(dbCommandDetail, "NextStateId", SqlDbType.Int, 32);
                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            recipients.Add(new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString()));
                        }
                        nextStateId = Convert.ToInt16(dbCommandDetail.Parameters["@NextStateId"].Value);
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        //internal static List<Recipient> getWorkOrderRecipientList(int transferNoteNo)
        //{
        //    List<Recipient> lr = new List<Recipient>();
        //    try
        //    {
        //        DbCommand dbCommandDetail = db.GetStoredProcCommand("getWorkOrderRecipientList");
        //        db.AddInParameter(dbCommandDetail, "TransferNoteNo", SqlDbType.Int, transferNoteNo);
        //        using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
        //        {
        //            if (ds != null && ds.Tables.Count > 0)
        //            {
        //                foreach (DataRow dr in ds.Tables[0].Rows)
        //                {
        //                    Recipient r = new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString());
        //                    lr.Add(r);
        //                }
        //            }
        //        }

        //    }
        //    catch (Exception)
        //    {
        //        lr = null;
        //        throw ex;
        //    }
        //    return lr;
        //}

        //internal static List<Recipient> getWorkOrderOwnerList(int transferNoteNo)
        //{
        //    List<Recipient> lr = new List<Recipient>();
        //    try
        //    {
        //        DbCommand dbCommandDetail = db.GetStoredProcCommand("getWorkOrderOwnerList");
        //        db.AddInParameter(dbCommandDetail, "TransferNoteNo", SqlDbType.Int, transferNoteNo);
        //        using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
        //        {
        //            if (ds != null && ds.Tables.Count > 0)
        //            {
        //                foreach (DataRow dr in ds.Tables[0].Rows)
        //                {
        //                    Recipient r = new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString());
        //                    lr.Add(r);
        //                }
        //            }
        //        }

        //    }
        //    catch (Exception)
        //    {
        //        lr = null;
        //        throw ex;
        //    }
        //    return lr;
        //}

        internal static List<Recipient> GetOwner(short _workflowId, int formid)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                DbCommand dbCommandDetail = db.GetStoredProcCommand("GetForm_Creator");
                db.AddInParameter(dbCommandDetail, "workflowId", SqlDbType.SmallInt, _workflowId);
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, formid);
                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            recipients.Add(new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString()));
                        }
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        internal static List<Recipient> GetWorkShopStaff(short companyid)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                DbCommand dbCommandDetail = db.GetStoredProcCommand("getWorkShopStaff");
                db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyid);
                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            recipients.Add(new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString()));
                        }
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }            
        }

        internal static List<Recipient> GetInvTransferOwner(int _transferId, short companyid)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                DbCommand dbCommandDetail = db.GetStoredProcCommand("GetInvTransferOwner");
                db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, _transferId);
                    db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyid);
                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            recipients.Add(new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString()));
                        }
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        internal static List<Recipient> GetInvTransferRecipients(int _transferId, short companyid)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetInvTransferRecipients"))
                {
                    db.AddInParameter(dbCommandDetail, "TransferId", SqlDbType.Int, _transferId);
                    db.AddInParameter(dbCommandDetail, "CompanyId", SqlDbType.SmallInt, companyid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                recipients.Add(new Recipient(
                                    dr["UserId"].ToString(),
                                    dr["UserName"].ToString()));
                            }
                        }
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        internal static List<Recipient> GetClientRateRecipients(int formId, short stateId, out short nextStateId)
        {
            try
            {
                List<Recipient> recipients = new List<Recipient>();
                nextStateId = stateId;
                DbCommand dbCommandDetail = db.GetStoredProcCommand("GetWF_ClientRateRecipients");
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, formId);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, stateId);
                db.AddOutParameter(dbCommandDetail, "nextStateId", SqlDbType.SmallInt, 16);

                using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            recipients.Add(new Recipient(dr["UserId"].ToString(), dr["UserName"].ToString()));
                        }
                        nextStateId = Convert.ToInt16(dbCommandDetail.Parameters["@NextStateId"].Value);
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        //internal static List<Recipient> GetInvoiceRecipients(int _FormId)
        //{
        //    List<Recipient> rList = new List<Recipient>();
        //    try
        //    {
        //        using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetInvoiceList"))
        //        {
        //            db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, _FormId);
        //            using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
        //            {
        //                if (ds != null && ds.Tables.Count > 0)
        //                {
        //                    foreach (DataRow dr in ds.Tables[0].Rows)
        //                    {
        //                        rList.Add(new Recipient(
        //                            dr["UserId"].ToString(),
        //                            dr["UserName"].ToString()));
        //                    }
        //                }
        //            }
        //        }
        //        return rList;
        //    }
        //    catch (Exception)
        //    { throw; }
        //}
        #endregion
    }
}