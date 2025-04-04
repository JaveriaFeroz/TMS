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
exports.PaymentService = void 0;
const core_1 = require("@angular/core");
let PaymentService = class PaymentService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getPayments() {
        return this.http.get(this.apiURL + 'finance/Payment/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/Payment/GetLookups');
    }
    get(pyNo) {
        return this.http.get(this.apiURL + 'finance/Payment/' + encodeURIComponent(pyNo));
    }
    save(py) {
        return this.http.post(this.apiURL + 'finance/Payment/', py);
    }
    reverse(pyNo) {
        return this.http.post(this.apiURL + 'finance/Payment/Reverse/' + encodeURIComponent(pyNo), null);
    }
    getOSPIVs(supplierId) {
        return this.http.get(this.apiURL + 'finance/Payment/GetOSPIVs/' + supplierId);
    }
};
PaymentService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map