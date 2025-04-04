import { agFooter } from '../../helper/footer';
import { InsClaim3rdParty } from './insclaim3rdparty';
import { InsClaimDoc } from './insclaimdoc';
import { InsClaimDriver } from './insclaimdriver';

export class InsClaim {
  claimId: number;
  claimDate: Date;
  //departmentCode:string;
  assetId: number;
  policyId: number;
  accidentDate?: Date;
  accidentLocation: string;
  workShopName: string;
  typeId: number;
  remarks: string;
  lossNo: string;
  surveyorName: string;
  policyNo: string;
  stateId: number;
  completed: boolean;
  companyid: number;
  drivers: InsClaimDriver[];
  documents: InsClaimDoc[] = [];
  parties: InsClaim3rdParty[] = [];
  //Recovery//
  amount: number;
  minDeductible: number;
  amountRcvd: number;
  chequeNo: string;
  chequeDate: Date;
  bankName: string;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}

