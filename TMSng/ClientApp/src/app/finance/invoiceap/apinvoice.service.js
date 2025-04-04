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
exports.APInvoiceService = void 0;
const core_1 = require("@angular/core");
let APInvoiceService = class APInvoiceService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getPIVs() {
        return this.http.get(this.apiURL + 'finance/APInvoice/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/APInvoice/GetLookups');
    }
    get(voucherNo) {
        return this.http.get(this.apiURL + 'finance/APInvoice/' + encodeURIComponent(voucherNo));
    }
    save(piv) {
        return this.http.post(this.apiURL + 'finance/APInvoice/', piv);
    }
    reverse(voucherNo) {
        return this.http.post(this.apiURL + 'finance/APInvoice/Reverse/' + encodeURIComponent(voucherNo), null);
    }
    getOSSlips(supplierId, dateFrom, dateTo) {
        return this.http.get(this.apiURL + 'finance/APInvoice/GetOSSlips/' + supplierId + '/' + encodeURIComponent(dateFrom.toString()) + '/' + encodeURIComponent(dateTo.toString()));
    }
};
APInvoiceService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], APInvoiceService);
exports.APInvoiceService = APInvoiceService;
//# sourceMappingURL=apinvoice.service.js.map