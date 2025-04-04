"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WF_ClientRate = void 0;
const footer_1 = require("../../helper/footer");
class WF_ClientRate {
    /*
      distanceByConsignee: boolean;
          detentionByTime: boolean;
              
        fixedPerTripPlusPerKM: ClientRateFixedPerTripPlusPerKM[] = [];
    deliveryTonnage: ClientRateDeliveryTonnage[] = [];
    tripLiter: ClientRateTripLiter[] = [];
  
  */
    constructor() {
        this.rateTypeId = 1;
        this.invoiceModeId = 2;
        this.waiverTon = 0;
        this.maxInvAmount = 0;
        this.maxShipmentsPerInvoice = 0;
        this.detGraceHrs = 0;
        this.detGraceHRsFromRWB = false;
        this.trips = [];
        this.tripTonSlabs = [];
        this.dedicatedRents = [];
        this.dedicatedVariables = [];
        this.dedicatedKMs = [];
        this.handling = [];
        this.detentions = [];
        this.footer = new footer_1.agFooter();
        this.maxInvAmount = 0;
        this.maxShipmentsPerInvoice = 0;
    }
}
exports.WF_ClientRate = WF_ClientRate;
//# sourceMappingURL=wf_clientrate.js.map