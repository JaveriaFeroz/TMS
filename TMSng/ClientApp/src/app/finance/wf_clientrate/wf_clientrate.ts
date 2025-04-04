import { agFooter } from "../../helper/footer";
import { WF_CRDedicatedKM } from "../wf_clientrate/wf_crdedicatedkm";
import { WF_CRDedicatedRent } from "../wf_clientrate/wf_crdedicatedrent";
import { WF_CRDedicatedTollTax } from '../wf_clientrate/wf_crdedicatedtolltax';
import { WF_CRDedicatedVariable } from "../wf_clientrate/wf_crdedicatedvariable";
import { WF_CRDetention } from "../wf_clientrate/wf_crdetention";
import { WF_CRFreightKLTon } from '../wf_clientrate/wf_crfreightklton';
import { WF_CRTrip } from "../wf_clientrate/wf_crtrip";
import { WF_CRTripTonSlab } from "../wf_clientrate/wf_crtriptonslab";
import { WF_CRHandling } from "./wf_crhandling";

export class WF_ClientRate {
  formId: number;
  clientId: number;
  rateTypeId: number = 1;
  invoiceModeId: number = 2;
  waiverTon: number = 0;
  maxInvAmount: number = 0;
  maxShipmentsPerInvoice: number = 0;
  detGraceHrs: number = 0;
  detGraceHRsFromRWB: boolean = false;
  //loadingChgs: number = 0;
  //offloadingChgs: number = 0;
  invoiceByRoute: boolean;
  invoiceByOrigin: boolean;
  invoiceByCategory: boolean;
  separateDetInv: boolean;
  separateOtherChgsInv: boolean;

  validateRoute: boolean;
  validateVehicle: boolean;
  //consigneeMandatory: boolean;
  categoryMandatory: boolean;
  productMandatory: boolean;
  invMandatoryOnPoD: boolean;
  oBDMandatoryOnPoD: boolean;
  shipmentNoMandatoryOnPoD: boolean;
  allowZeroRate: boolean;
  inProcessForm: boolean;

  trips: WF_CRTrip[] = [];
  tripTonSlabs: WF_CRTripTonSlab[] = [];
  dedicatedRents: WF_CRDedicatedRent[] = [];
  dedicatedVariables: WF_CRDedicatedVariable[] = [];
  dedicatedKMs: WF_CRDedicatedKM[] = [];
  dedicatedTollTax: WF_CRDedicatedTollTax[];
  handling: WF_CRHandling[] = [];
  freightKLTons: WF_CRFreightKLTon[];
  detentions: WF_CRDetention[] = [];

  stateId: number;
  stateName: string;
  owner: string;
  approved: boolean;
  rejected: boolean;
  completed: boolean;
  footer: agFooter;
  /*
    distanceByConsignee: boolean;
        detentionByTime: boolean;
            
      fixedPerTripPlusPerKM: ClientRateFixedPerTripPlusPerKM[] = [];
  deliveryTonnage: ClientRateDeliveryTonnage[] = [];
  tripLiter: ClientRateTripLiter[] = [];

*/
  constructor() { this.footer = new agFooter(); this.maxInvAmount = 0; this.maxShipmentsPerInvoice = 0; }
}
