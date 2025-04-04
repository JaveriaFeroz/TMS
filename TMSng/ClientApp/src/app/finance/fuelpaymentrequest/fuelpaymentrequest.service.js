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
exports.FuelPaymentRequestService = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
let FuelPaymentRequestService = class FuelPaymentRequestService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getRequests() {
        return this.http.get(this.apiURL + 'finance/FuelPaymentRequest/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/FuelPaymentRequest/GetLookups');
    }
    get(requestId) {
        return this.http.get(this.apiURL + 'finance/FuelPaymentRequest/' + requestId);
    }
    getCardPending(cardId, dateFrom, dateTo) {
        return this.http.get(this.apiURL + 'finance/FuelPaymentRequest/GetForCard/' + cardId + '/' +
            common_1.formatDate(dateFrom, "yyyy-MM-dd", "en-uk", "+0500") + '/' + common_1.formatDate(dateTo, "yyyy-MM-dd", "en-uk", "+0500"));
    }
    getSupplierPending(supplierId, dateFrom, dateTo) {
        return this.http.get(this.apiURL + 'finance/FuelPaymentRequest/GetForSupplier/' + supplierId + '/' +
            common_1.formatDate(dateFrom, "yyyy-MM-dd", "en-uk", "+0500") + '/' + common_1.formatDate(dateTo, "yyyy-MM-dd", "en-uk", "+0500"));
    }
    save(fp) {
        return this.http.post(this.apiURL + 'finance/FuelPaymentRequest/', fp);
    }
};
FuelPaymentRequestService = __decorate([
    core_1.Injectable({ providedIn: 'root' }),
    __param(1, core_1.Inject('API_BASE_URL'))
], FuelPaymentRequestService);
exports.FuelPaymentRequestService = FuelPaymentRequestService;
//# sourceMappingURL=fuelpaymentrequest.service.js.map