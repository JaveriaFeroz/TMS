import { agFooter } from '../../helper/footer';
import { DriverDocument } from './driverdocument';
import { DriverMedical } from './drivermedical';
import { DriverReference } from './driverreference';
import { DriverTraining } from './drivertaining';

export class Driver {
  driverId: number;
  driverName: string;
  fatherName: string;
  address: string;
  doB: Date;
  cellNo: string;
  licenseNo: string;
  licenseExpiry: Date;
  cnic: string;
  cnicExpiry: Date;
  qualificationId: number;
  noKRelationId: number;
  noKName: string;
  joiningDate: Date;
  separationDate: Date;
  separationTypeId: number;
  separationReason: string;
  branchId: number;
  designation: number;
  employeeNo: string;
  contractorId: number;
  workExperience: number;
  monthlySalary: number;
  previousEmployer: string;
  //previousEmployer2: string;
  isActive: boolean;
  picture: string;
  fileName: string;
  fileContent: string;
  contentType: string;
  documents: DriverDocument[] = [];
  medicals: DriverMedical[] = [];
  references: DriverReference[] = [];
  trainings: DriverTraining[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}

