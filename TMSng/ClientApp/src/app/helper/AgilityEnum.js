"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgilityEnum = void 0;
const core_1 = require("@angular/core");
let AgilityEnum = class AgilityEnum {
    constructor() {
        // public const int CEO = 5;
        // public const int WorkshopStaff = 23;
        this.WOMinorMaintenance = 5;
        this.WOMajorMaintenance = 6;
    }
    ServiceRequestState(stateId) {
        switch (stateId) {
            case 0:
                return "New";
            case 1:
                return "Saved";
            case 2:
                return "Submitted to Workshop";
            case 3:
                return "Returned by Workshop";
            case 4:
                return "Resolved";
            case 5:
                return "Cancelled";
        }
    }
    WorkOrderState(stateId) {
        switch (stateId) {
            case 0:
                return "New";
            case 1:
                return "Saved";
            case 2:
                return "Submitted For Approval";
            case 3:
                return "Submitted To WorkShop";
            case 4:
                return "Rejected";
            case 5:
                return "Retrun";
            case 6:
                return "Resolved By Work Shop";
            case 7:
                return "Acknowledged By Operation";
            case 8:
                return "Return By Operation";
            case 11:
                return "Forward To Management";
        }
    }
    RateState(stateId) {
        switch (stateId) {
            case 0:
                return "New";
            case 1:
                return "Saved";
            case 2:
                return "Submitted for Approval";
            case 3:
                return "Approved";
            case 4:
                return "Rejected";
            case 5:
                return "Return";
            case 99:
                return "Cancelled";
        }
    }
    WorkFlowState(stateId) {
        switch (stateId) {
            case 0:
                return "New";
            case 1:
                return "Saved";
            case 2:
                return "Submitted For Approval";
            case 3:
                return "Approved";
            case 4:
                return "Rejected";
            case 5:
                return "Return";
            case 6:
                return "Resolved By Work Shop";
            case 7:
                return "Acknowledged By Operation";
            case 8:
                return "Rejected By Operation";
            case 9:
                return "Transferred (InTransit)";
            case 10:
                return "Received";
            case 99:
                return "Cancelled";
        }
    }
    AccountTypeId(accountTypeName) {
        switch (accountTypeName) {
            case 'Control':
                return 1;
            case 'Subsidiary':
                return 2;
            case 'Reporting':
                return 3;
            case 'SubReporting':
                return 4;
        }
    }
    WorkFlowId(workflowName) {
        switch (workflowName) {
            case 'ALL':
                return 0;
            case 'PurchaseRequisition':
                return 1;
            case 'PurchaseOrder':
                return 2;
            case 'WorkOrder':
                return 3;
            case 'MaterialRequest':
                return 4;
            case 'GRN':
                return 5;
            case 'MaterialIssuance':
                return 6;
            case 'InventoryAdjustment':
                return 7;
            case 'InventoryTransfer':
                return 8;
            case 'ServiceRequest':
                return 9;
            case 'RateSetup':
                return 13;
        }
    }
};
AgilityEnum = __decorate([
    core_1.Injectable({ providedIn: 'root' })
], AgilityEnum);
exports.AgilityEnum = AgilityEnum;
(function (AgilityEnum) {
    let WorkFlow;
    (function (WorkFlow) {
        WorkFlow[WorkFlow["ALL"] = 0] = "ALL";
        WorkFlow[WorkFlow["PurchaseRequisition"] = 1] = "PurchaseRequisition";
        WorkFlow[WorkFlow["PurchaseOrder"] = 2] = "PurchaseOrder";
        WorkFlow[WorkFlow["WorkOrder"] = 3] = "WorkOrder";
        WorkFlow[WorkFlow["MaterialRequest"] = 4] = "MaterialRequest";
        WorkFlow[WorkFlow["GRN"] = 5] = "GRN";
        WorkFlow[WorkFlow["MaterialIssuance"] = 6] = "MaterialIssuance";
        WorkFlow[WorkFlow["InventoryAdjustment"] = 7] = "InventoryAdjustment";
        WorkFlow[WorkFlow["InventoryTransfer"] = 8] = "InventoryTransfer";
        WorkFlow[WorkFlow["ServiceRequest"] = 9] = "ServiceRequest";
        WorkFlow[WorkFlow["RateSetup"] = 13] = "RateSetup";
    })(WorkFlow || (WorkFlow = {}));
})(AgilityEnum = exports.AgilityEnum || (exports.AgilityEnum = {}));
exports.AgilityEnum = AgilityEnum;
//# sourceMappingURL=AgilityEnum.js.map