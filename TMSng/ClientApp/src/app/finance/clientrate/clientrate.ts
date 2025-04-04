import { agFooter } from "../../helper/footer";
import { CRDedicatedKM } from "./crdedicatedkm";
import { CRDedicatedRent } from "./crdedicatedrent";
import { CRDedicatedTollTax } from './crdedicatedtolltax';
import { CRDedicatedVariable } from "./crdedicatedvariable";
import { CRDetention } from "./crdetention";
import { CRFreightKLTon } from './crfreightklton';
import { CRHandling } from "./crhandling";
import { CRTrip } from "./crtrip";
import { CRTripTonSlab } from "./crtriptonslab";

export class ClientRate {
  clientId: number;
  rateTypeId?: number;
  rateTypeName: string;
  invoiceModeName: string;
  waiverTon: number;
  maxInvAmount: number;
  maxShipmentsPerInvoice: number;
  detGraceHrs: number;
  detGraceHRsFromRwb: boolean;
  //loadingChgs: number;
  //offloadingChgs: number;
  invoiceByRoute: boolean;
  invoiceByOrigin: boolean;
  invoiceByCategory: boolean;
  separateDetInv: boolean;
  separateOtherChgsInv: boolean;

  validateRoute: boolean;
  validateVehicle: boolean;
  consigneeMandatory: boolean;
  categoryMandatory: boolean;
  productMandatory: boolean;
  invMandatoryOnPoD: boolean;
  oBDMandatoryOnPoD: boolean;
  shipmentNoMandatoryOnPoD: boolean;
  allowZeroRate: boolean;

  trips: CRTrip[] = [];
  tripTonSlabs: CRTripTonSlab[] = [];
  dedicatedRents: CRDedicatedRent[] = [];
  dedicatedVariables: CRDedicatedVariable[] = [];
  dedicatedKMs: CRDedicatedKM[] = [];
  dedicatedTollTax: CRDedicatedTollTax[];
  freightKLTons: CRFreightKLTon[];
  detentions: CRDetention[] = [];
  handling: CRHandling[] = [];
  footer: agFooter;
  /*formId: number;
    distanceByConsignee: boolean;
        detentionByTime: boolean;
            stateId: number;
    stateName: string;
    owner: string;
    isCompleted: boolean;
      fixedPerTripPlusPerKM: ClientRateFixedPerTripPlusPerKM[] = [];
  deliveryTonnage: ClientRateDeliveryTonnage[] = [];
  tripLiter: ClientRateTripLiter[] = [];
*/
  constructor() { this.footer = new agFooter(); }
}
