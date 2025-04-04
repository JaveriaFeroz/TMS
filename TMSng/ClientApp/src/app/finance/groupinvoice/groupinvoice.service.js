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
exports.GroupInvoiceService = void 0;
const core_1 = require("@angular/core");
let GroupInvoiceService = class GroupInvoiceService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getInvoices() {
        return this.http.get(this.apiURL + 'finance/GroupInvoice/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/GroupInvoice/GetLookups');
    }
    get(invoiceNo) {
        return this.http.get(this.apiURL + 'finance/GroupInvoice/' + encodeURIComponent(invoiceNo));
    }
    load(clientId) {
        return this.http.get(this.apiURL + 'finance/GroupInvoice/GetPendingInvoices/' + clientId);
    }
    save(gi) {
        return this.http.post(this.apiURL + 'finance/GroupInvoice/', gi);
    }
};
GroupInvoiceService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], GroupInvoiceService);
exports.GroupInvoiceService = GroupInvoiceService;
//# sourceMappingURL=groupinvoice.service.js.map