"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WOExtractService = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
let WOExtractService = class WOExtractService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getLookup() {
        return this.http.get(this.apiURL + 'download/Shortage/GetLookups');
    }
    getPendingRequest(datefrom, dateto) {
        return this.http.get(this.apiURL + 'operation/ServiceRequest/GetPending/' + common_1.formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + common_1.formatDate(dateto, 'yyyy-MM-dd', 'en-US'));
    }
    getPending(datefrom, dateto) {
        return this.http.get(this.apiURL + 'operation/WorkOrder/GetPending/' + common_1.formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + common_1.formatDate(dateto, 'yyyy-MM-dd', 'en-US'));
    }
    getClosed(periodFromId, periodToId) {
        return this.http.get(this.apiURL + 'operation/WorkOrder/GetClosed/' + periodFromId + '/' + periodToId);
    }
};
WOExtractService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], WOExtractService);
exports.WOExtractService = WOExtractService;
//# sourceMappingURL=woextract.service.js.map