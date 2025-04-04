using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using TMSAPI.Helper;

namespace TMSAPI.Areas.Master.Models
{
    public class Driver : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? DriverId { get; set; }
        public string DriverName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public DateTime DoB { get; set; }
        public string CellNo { get; set; }
        public string LicenseNo { get; set; }
        public DateTime LicenseExpiry { get; set; }
        public string CNIC { get; set; }
        public DateTime? CNICExpiry { get; set; }
        public short? QualificationId { get; set; }
        public string NoKName { get; set; }
        public short? NoKRelationId { get; set; }
        public DateTime? JoiningDate { get; set; }
        public DateTime? SeparationDate { get; set; }
        public short? SeparationTypeId { get; set; }
        public string SeparationReason { get; set; }
        public short? BranchId { get; set; }
        public string Designation { get; set; }
        public string EmployeeNo { get; set; }
        public short? ContractorId { get; set; }
        public decimal WorkExperience { get; set; }
        public decimal MonthlySalary { get; set; }
        public string PreviousEmployer { get; set; }
        //public string PreviousEmployer2 { get; set; }
        public bool IsActive { get; set; }
        public string Picture { get; set; }
        public List<DriverMedical> Medicals { get; set; } = new List<DriverMedical>();
        public List<DriverReference> References { get; set; } = new List<DriverReference>();
        public List<DriverTraining> Trainings { get; set; } = new List<DriverTraining>();
        //public List<DriverHVType> DHT { get; set; } = new List<DriverHVType>();
        public List<DriverDocument> Documents { get; set; } = new List<DriverDocument>();
        public agFooter Footer { get; set; } = new agFooter();       
        #endregion

        #region constructor
        public Driver()
        {
        }
        #endregion

        #region internal methods
        internal static Driver Get(int driverId, short companyId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDriverById"))
            {
                db.AddInParameter(dbCommand, "DriverId", SqlDbType.Int, driverId);
                db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Driver
                        {
                            DriverId = driverId,
                            DriverName = dr["DriverName"].ToString(),
                            FatherName = dr["FatherName"].ToString(),
                            Address = dr["Address"].ToString(),
                            DoB = Convert.ToDateTime(dr["BirthDate"]),
                            CNIC = dr["CNIC"].ToString(),
                            CNICExpiry = agHelper.dtDBNull(dr["CNICExpiry"]),
                            QualificationId = agHelper.sDBNull(dr["QualificationId"]),
                            NoKName = dr["NoKName"].ToString(),
                            NoKRelationId = agHelper.sDBNull(dr["NoKRelationId"]),
                            JoiningDate = agHelper.dtDBNull(dr["JoiningDate"]),
                            SeparationDate = agHelper.dtDBNull(dr["SeparationDate"]),
                            SeparationTypeId = agHelper.sDBNull(dr["SeparationTypeId"]),
                            SeparationReason = dr["SeparationReason"].ToString(),
                            BranchId = agHelper.sDBNull(dr["BranchId"]),
                            Designation = dr["Designation"].ToString(),
                            EmployeeNo = dr["EmployeeNo"].ToString(),
                            ContractorId = agHelper.sDBNull(dr["ContractorId"]),
                            MonthlySalary = Convert.ToDecimal(dr["MonthlySalary"]),
                            Picture = dr["DriverPicture"].ToString(),
                            WorkExperience = Convert.ToDecimal(dr["Experience"]),
                            PreviousEmployer = dr["PreviousEmployer"].ToString(),
                            //PreviousEmployer2 = dr["PreviousEmployer2"].ToString(),
                            CellNo = dr["CellNo"].ToString(),
                            LicenseNo = dr["LicenseNo"].ToString(),
                            LicenseExpiry = Convert.ToDateTime(dr["LicenseExpiry"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr),
                            Medicals = DriverMedical.Get(driverId),
                            References = DriverReference.Get(driverId),
                            Trainings = DriverTraining.Get(driverId),
                            Documents = DriverDocument.Get(driverId),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Driver d, short companyId, string userId)
        {
            using (DbConnection dbConnection = db.CreateConnection())
            {
                dbConnection.Open();
                DbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDriver"))
                    {
                        db.AddInParameter(dbCommand, "driverid", SqlDbType.Int, d.DriverId);
                        db.AddInParameter(dbCommand, "drivername", SqlDbType.VarChar, d.DriverName);
                        db.AddInParameter(dbCommand, "fathername", SqlDbType.VarChar, d.FatherName);
                        db.AddInParameter(dbCommand, "Address", SqlDbType.VarChar, d.Address);
                        db.AddInParameter(dbCommand, "DoB", SqlDbType.DateTime, d.DoB);
                        db.AddInParameter(dbCommand, "Cellno", SqlDbType.VarChar, d.CellNo);
                        db.AddInParameter(dbCommand, "LicenseNo", SqlDbType.VarChar, d.LicenseNo);
                        db.AddInParameter(dbCommand, "LicenseExpiry", SqlDbType.DateTime, d.LicenseExpiry);
                        db.AddInParameter(dbCommand, "CNIC", SqlDbType.VarChar, d.CNIC);
                        db.AddInParameter(dbCommand, "CNICExpiry", SqlDbType.DateTime, d.CNICExpiry);
                        db.AddInParameter(dbCommand, "QualificationId", SqlDbType.SmallInt, d.QualificationId);
                        db.AddInParameter(dbCommand, "NoKName", SqlDbType.VarChar, d.NoKName);
                        db.AddInParameter(dbCommand, "NoKRelationId", SqlDbType.Int, d.NoKRelationId);
                        db.AddInParameter(dbCommand, "JoiningDate", SqlDbType.DateTime, d.JoiningDate);
                        db.AddInParameter(dbCommand, "SeparationDate", SqlDbType.DateTime, d.SeparationDate);
                        db.AddInParameter(dbCommand, "SeparationTypeId", SqlDbType.SmallInt, d.SeparationTypeId);
                        db.AddInParameter(dbCommand, "SeparationReason", SqlDbType.VarChar, d.SeparationReason);
                        db.AddInParameter(dbCommand, "BranchId", SqlDbType.SmallInt, d.BranchId);
                        db.AddInParameter(dbCommand, "Designation", SqlDbType.VarChar, d.Designation);
                        db.AddInParameter(dbCommand, "EmployeeNo", SqlDbType.VarChar, d.EmployeeNo);
                        db.AddInParameter(dbCommand, "ContractorId", SqlDbType.SmallInt, d.ContractorId);
                        db.AddInParameter(dbCommand, "Experience", SqlDbType.Float, d.WorkExperience);
                        db.AddInParameter(dbCommand, "MonthlySalary", SqlDbType.Float, d.MonthlySalary);
                        db.AddInParameter(dbCommand, "PrvEmployer", SqlDbType.VarChar, d.PreviousEmployer);
                        //db.AddInParameter(dbCommand, "PEmployer2", SqlDbType.VarChar, d.PreviousEmployer2);
                        db.AddInParameter(dbCommand, "DriverPicture ", SqlDbType.VarChar, d.Picture);
                        db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, d.IsActive);
                        db.AddInParameter(dbCommand, "CompanyId", SqlDbType.SmallInt, companyId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, d.Footer.UpdatedOn);
                        db.AddOutParameter(dbCommand, "newDriverId", SqlDbType.Int, 32);

                        db.ExecuteNonQuery(dbCommand, transaction);
                        d.DriverId = Convert.ToInt32(dbCommand.Parameters["@newDriverId"].Value);
                        DriverMedical.Save(d.DriverId, d.Medicals, userId, transaction);
                        DriverReference.Save(d.DriverId, d.References, userId, transaction);
                        DriverTraining.Save(d.DriverId, d.Trainings, userId, transaction);
                        //  DriverHVType.Save(d.DriverId, d.DHT, userId, transaction);
                        DriverDocument.Delete(Convert.ToInt32(d.DriverId), d.Documents, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                }
                catch (Exception) { transaction.Rollback(); throw; }
            }
        }
        #endregion
                
        #region IDisposable Members

        public void Dispose()
        {
            //db = null;
        }

        #endregion
    }
}