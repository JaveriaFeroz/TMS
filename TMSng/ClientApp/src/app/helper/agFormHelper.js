"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agFormHelper = exports.agFormMode = void 0;
const core_1 = require("@angular/core");
var agFormMode;
(function (agFormMode) {
    agFormMode[agFormMode["Initialize"] = 0] = "Initialize";
    agFormMode[agFormMode["Add"] = 1] = "Add";
    agFormMode[agFormMode["Edit"] = 2] = "Edit";
    agFormMode[agFormMode["Recall"] = 3] = "Recall";
    agFormMode[agFormMode["ReadOnly"] = 4] = "ReadOnly";
    agFormMode[agFormMode["Review"] = 5] = "Review";
})(agFormMode = exports.agFormMode || (exports.agFormMode = {}));
let agFormHelper = class agFormHelper {
    constructor(svcToaster) {
        this.svcToaster = svcToaster;
    }
    static setFormControls(optionName, formMode) {
        var data = JSON.parse(sessionStorage.getItem("UserAccess")).find(o => o.optionName == optionName);
        if (data) {
            var canAdd = data.canAdd;
            var canEdit = data.canEdit;
            if (document.getElementById('btnAdd') != null) {
                document.getElementById('btnAdd').disabled = !canAdd || formMode != agFormMode.Initialize;
            }
            if (document.getElementById('btnEdit') != null) {
                document.getElementById('btnEdit').disabled = !canEdit || formMode != agFormMode.ReadOnly;
            }
            if (document.getElementById('btnSave') != null) {
                document.getElementById('btnSave').disabled = (formMode != agFormMode.Edit || !canEdit) && formMode != agFormMode.Add;
            }
            if (formMode != agFormMode.Initialize) {
                if (document.getElementById('btnSearch') != null) {
                    document.getElementById('btnSearch').disabled = true;
                }
                document.getElementById('btnUndo').disabled = false;
            }
            else {
                if (document.getElementById('btnSearch') != null) {
                    document.getElementById('btnSearch').disabled = false;
                }
                document.getElementById('btnUndo').disabled = true;
            }
            if (document.getElementById('btnRecall') != null) {
                document.getElementById('btnRecall').disabled = formMode != agFormMode.Initialize;
            }
            document.getElementById('btnExit').disabled = (formMode != agFormMode.Initialize) && (formMode != agFormMode.Review);
            if (formMode == agFormMode.ReadOnly) {
                if (document.getElementById('btnEdit'))
                    document.getElementById('btnEdit').focus();
            }
            //if (formMode == agFormMode.Add || formMode == agFormMode.Edit) {
            //  $("#divMain div[class*='ag-root-wrapper']").removeClass('ag-disabled');
            //}
        }
        else {
            if (document.getElementById('btnAdd'))
                document.getElementById('btnAdd').disabled = true;
            if (document.getElementById('btnEdit'))
                document.getElementById('btnEdit').disabled = true;
            if (document.getElementById('btnDelete'))
                document.getElementById('btnDelete').disabled = true;
            if (document.getElementById('btnSave'))
                document.getElementById('btnSave').disabled = true;
            if (document.getElementById('btnRecall'))
                document.getElementById('btnRecall').disabled = true;
            if (document.getElementById('btnSearch'))
                document.getElementById('btnSearch').disabled = true;
        }
    }
    static setGridToolbar(enable) {
        document.querySelectorAll('[id^="tbGrid"]').forEach(x => x.querySelectorAll("button").forEach((a) => {
            if (enable) {
                a.removeAttribute('disabled');
            }
            else if (!a.hasAttribute('disabled')) {
                a.setAttribute('disabled', 'true');
            }
        }));
        //if (document.getElementById('tbGrid') as HTMLDivElement != null) {     
        //  var div: HTMLDivElement = document.getElementById('tbGrid') as HTMLDivElement;     
        //  var buttons = div.querySelectorAll("button");
        //  buttons.forEach((a) => {
        //  if (enable) {
        //    a.removeAttribute('disabled');       
        //  }
        //  else if (!a.hasAttribute('disabled')) {
        //    a.setAttribute('disabled', 'true');         
        //  }
        //});
        //}
    }
    static setGridStatus(enable = true) {
        if (enable)
            document.querySelectorAll('[id^="grd"]').forEach(x => x.classList.remove('ag-disabled'));
        else
            document.querySelectorAll('[id^="grd"]:not([class~="ag-disabled"])').forEach(x => x.classList.add('ag-disabled'));
    }
    static setFormSearch(enable) {
        if (document.getElementById('tbSearch') != null) {
            var div = document.getElementById('tbSearch');
            var buttons = div.querySelectorAll("button");
            buttons.forEach((a) => {
                if (enable) {
                    a.removeAttribute('disabled');
                }
                else if (!a.hasAttribute('disabled')) {
                    a.setAttribute('disabled', 'true');
                }
            });
        }
    }
    static setFormSubmissionControls(formMode) {
        if (formMode == agFormMode.ReadOnly || formMode == agFormMode.Review) {
            if (document.getElementById('btnHistory'))
                document.getElementById('btnHistory').disabled = false;
            if (document.getElementById('btnTransfer') != null)
                document.getElementById("btnTransfer").disabled = false;
            if (document.getElementById('btnReceived') != null)
                document.getElementById("btnReceived").disabled = false;
        }
        else {
            if (document.getElementById('btnHistory'))
                document.getElementById('btnHistory').disabled = true;
            if (document.getElementById('btnTransfer') != null)
                document.getElementById("btnTransfer").disabled = true;
            if (document.getElementById('btnReceived') != null)
                document.getElementById("btnReceived").disabled = true;
        }
    }
    static currentCompany() {
        return Number(sessionStorage.getItem("CompanyId"));
    }
    static enableGL() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.enableGL;
    }
    static enablePartialDelivery() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.enablePartialDelivery;
    }
    static arId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.arAccountId;
    }
    static arPeriodId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.arPeriodId;
    }
    static apId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.apAccountId;
    }
    static apPeriodId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.apPeriodId;
    }
    static glPeriodId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.glPeriodId;
    }
    static opsPeriodId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.opsPeriodId;
    }
    static periodName() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.periodName;
    }
    static advanceACId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.advanceAccountId;
    }
    static bankControlId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.bankAccountId;
    }
    static fuelExpACId() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.fuelExpenseAccountId;
    }
    static IsMandatoryDriver2() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.isMandatoryDriver2;
    }
    static AllowTrailer() {
        let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
        return cc.allowTrailer;
    }
    static getISODate(date) {
        date = new Date(date);
        return new Date(date.setHours(date.getHours() + (date.getTimezoneOffset() * -1 / 60))).toISOString().split('T')[0];
    }
    static padL(text, padChar = "0", size = 10) {
        return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
    }
};
agFormHelper = __decorate([
    core_1.Injectable({ providedIn: 'root' })
], agFormHelper);
exports.agFormHelper = agFormHelper;
//# sourceMappingURL=agFormHelper.js.map