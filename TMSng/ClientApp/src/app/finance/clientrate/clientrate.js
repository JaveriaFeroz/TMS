"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRate = void 0;
const footer_1 = require("../../helper/footer");
class ClientRate {
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
    constructor() {
        this.trips = [];
        this.tripTonSlabs = [];
        this.dedicatedRents = [];
        this.dedicatedVariables = [];
        this.dedicatedKMs = [];
        this.detentions = [];
        this.handling = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.ClientRate = ClientRate;
//# sourceMappingURL=clientrate.js.map