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
exports.PLSummaryService = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
let PLSummaryService = class PLSummaryService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getLookup() {
        return this.http.get(this.apiURL + 'download/Shortage/GetLookups');
    }
    GetRoutePL(datefrom, dateto, jobPeriodId, dataBasisId) {
        return this.http.get(this.apiURL + 'download/PLSummary/GetRoutePL/' + (0, common_1.formatDate)(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + (0, common_1.formatDate)(dateto, 'yyyy-MM-dd', 'en-US') + '/' + jobPeriodId + '/' + dataBasisId);
    }
    GetConsigneePL(datefrom, dateto, jobPeriodId, dataBasisId) {
        return this.http.get(this.apiURL + 'download/PLSummary/GetConsigneePL/' + (0, common_1.formatDate)(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + (0, common_1.formatDate)(dateto, 'yyyy-MM-dd', 'en-US') + '/' + jobPeriodId + '/' + dataBasisId);
    }
};
PLSummaryService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    }),
    __param(1, (0, core_1.Inject)('API_BASE_URL'))
], PLSummaryService);
exports.PLSummaryService = PLSummaryService;
//# sourceMappingURL=plsummary.service.js.map