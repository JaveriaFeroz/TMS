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
exports.JRService = void 0;
const core_1 = require("@angular/core");
let JRService = class JRService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getReceipts() {
        return this.http.get(this.apiURL + 'finance/JR/');
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/JR/GetLookups');
    }
    get(voucherNo) {
        return this.http.get(this.apiURL + 'finance/JR/' + encodeURIComponent(voucherNo));
    }
    save(jr) {
        return this.http.post(this.apiURL + 'finance/JR/', jr);
    }
    reverse(voucherNo) {
        return this.http.post(this.apiURL + 'finance/JR/Reverse/' + encodeURIComponent(voucherNo), null);
    }
};
JRService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], JRService);
exports.JRService = JRService;
//# sourceMappingURL=jr.service.js.map