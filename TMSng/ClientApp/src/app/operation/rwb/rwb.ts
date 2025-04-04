import { agFooter } from "../../helper/footer";
import { RWBCharges } from './rwbcharges';
import { RWBConsignee } from "./rwbconsignee";
import { RWBSKU } from "./rwbsku";

export class RWB {
  rwbId: number;
  rwbNo: string;
  jobNo: string;
  rwbDate: Date;
  clientId: number;
  shipperId: number;
  routeId: number;
  capacityId: number;
  capacityName: string;
  emptyTrip: boolean;
  outSourced: boolean;
  startKMs: number;
  endKMs: number;
  pkgs: number;
  weight: number;
  weight_Excess: number;
  rateTypeId: number;
  chargeTypeId: number;
  //rate: number;
  //ratePerKm: number;
  //loadingCharges: number;
  //offLoadingCharges: number;
  //rateExcessWeightPerKg: number;
  //detentionCharges: number;
  detHRs: number;
  detGraceHRs: number;
  wayTypeId: number;
  tdrNo: string;
  linkedRWBNo: string;
  stateId: number;
  stateName: string;
  gatePassNo: string;
  customerOrderNo: string;
  comments: string;
  categoryId: number;
  consigneeId: number;
  assetId: number;
  rentedAssetId: string;
  multiDrop: boolean;
  paymentModeId: number;
  categoryMandatory: boolean;
  productMandatory: boolean;
  vehicleCapacity: number;
  weight_Delivered: number;
  weight_Carried: number;
  charges: RWBCharges[] = [];
  skUs: RWBSKU[] = [];
  consignees: RWBConsignee[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }   
}
    
