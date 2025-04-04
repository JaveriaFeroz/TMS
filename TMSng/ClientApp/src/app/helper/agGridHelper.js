"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agGridHelper = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
//#region AG Grid Controls
let agGridHelper = class agGridHelper {
    constructor() { }
    static getCellCheckBox() {
        function chkBox() { }
        // gets called once before the renderer is used
        chkBox.prototype.init = function (params) {
            // create the cell
            this.eInput = document.createElement('input');
            this.eInput.type = "checkbox";
            this.eInput.checked = params.value;
        };
        // gets called once when grid ready to insert the element
        chkBox.prototype.getGui = function () {
            return this.eInput;
        };
        // focus and select can be done after the gui is attached
        chkBox.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        // returns the new value after editing
        chkBox.prototype.getValue = function () { return this.eInput.checked; };
        // any cleanup we need to be done here
        chkBox.prototype.destroy = function () { };
        // if true, then this editor will appear in a popup
        chkBox.prototype.isPopup = function () {
            return false;
        };
        return chkBox;
    }
    static getDatePicker() {
        function Datepicker() { }
        Datepicker.prototype.init = function (params) {
            this.eInput = document.createElement("input");
            this.eInput.value = params.value;
            (this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
        };
        Datepicker.prototype.getGui = function () {
            return this.eInput;
        };
        Datepicker.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        Datepicker.prototype.getValue = function () {
            return this.eInput.value;
        };
        Datepicker.prototype.destroy = function () { };
        Datepicker.prototype.isPopup = function () {
            return false;
        };
        return Datepicker;
    }
    static getTimePicker() {
        function TimeEditor() { }
        // gets called once before the renderer is used
        TimeEditor.prototype.init = function (params) {
            // create the cell
            this.Input = document.createElement('input');
            this.Input.value = params.value;
            (this.Input).timepicker({
                timeformat: "hh:mm"
            });
        };
        // gets called once when grid ready to insert the element
        TimeEditor.prototype.getGui = function () {
            return this.eInput;
        };
        // focus and select can be done after the gui is attached
        TimeEditor.prototype.afterGuiAttached = function () {
            this.Input.focus();
            this.Input.select();
        };
        // returns the new value after editing
        TimeEditor.prototype.getValue = function () { return this.Input.value; };
        // any cleanup we need to be done here
        TimeEditor.prototype.destroy = function () { };
        // if true, then this editor will appear in a popup
        TimeEditor.prototype.isPopup = function () {
            return false;
        };
        return TimeEditor;
    }
    static getAgilitySelect() {
        function AgilitySelect() { }
        AgilitySelect.prototype.init = function (params) {
            try {
                //var parentScope = angular.element($("#ngForm")).scope();
                this.dropDown = document.createElement('select');
                //this.dropDown.className = params.class;
                //this.dropDown.className = params.class;
                //this.dropDown.style.color = "blue";
                //this.dropDown.style.width = "300px";
                var style = 'width:' + params.class + 'px;color:blue; background-color:yellow;font-weight: bolder; height:32px; padding-top:0; margin-top: 0; margin-bottom:0;border: 2px blue solid';
                //
                this.dropDown.style.cssText = style;
                switch (params.source) {
                    case "Product":
                        var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
                        lstProduct.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.productId;
                            opt.innerHTML = x.productName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "SKU":
                        var lstSKU = JSON.parse(sessionStorage.getItem("lstSKU"));
                        lstSKU.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.skuId;
                            opt.innerHTML = x.skuName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    //case "ProductType":
                    //  var lstProductType = JSON.parse(sessionStorage.getItem("lstProductType"));
                    //  lstProductType.forEach(x => {
                    //    var opt = document.createElement('option');
                    //    opt.value = x.typeId;
                    //    opt.innerHTML = x.typeName;
                    //    this.dropDown.appendChild(opt);
                    //  });
                    //  break;
                    case "Asset":
                        var lstAsset = JSON.parse(sessionStorage.getItem("lstAsset"));
                        lstAsset.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.assetId;
                            opt.innerHTML = x.assetNo;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Department":
                        var lstDepartment = JSON.parse(sessionStorage.getItem("lstDepartment"));
                        lstDepartment.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.departmentId;
                            opt.innerHTML = x.departmentName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Branch":
                        var lstBranch = JSON.parse(sessionStorage.getItem("lstBranch"));
                        lstBranch.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.branchId;
                            opt.innerHTML = x.branchName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "InsuranceDocument":
                        var lstInsuranceDocuments = JSON.parse(sessionStorage.getItem("lstDocumentType"));
                        lstInsuranceDocuments.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.documentId;
                            opt.innerHTML = x.documentName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "PaymentType":
                        var lstPaymentTypes = JSON.parse(sessionStorage.getItem("lstPaymentType"));
                        lstPaymentTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.paymentTypeId;
                            opt.innerHTML = x.paymentTypeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Client":
                        var lstClients = JSON.parse(sessionStorage.getItem("lstClient"));
                        lstClients.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.clientId;
                            opt.innerHTML = x.clientName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Relation":
                        var lstRelations = JSON.parse(sessionStorage.getItem("lstRelation"));
                        lstRelations.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.relationId;
                            opt.innerHTML = x.relationName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "MedicalTest":
                        var lstMedicalTest = JSON.parse(sessionStorage.getItem("lstMedicalTest"));
                        lstMedicalTest.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.testId;
                            opt.innerHTML = x.testName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "InvFormat":
                        var lstInvoiceFormat = JSON.parse(sessionStorage.getItem("lstInvoiceFormat"));
                        lstInvoiceFormat.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.formatId;
                            opt.innerHTML = x.formatName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Supplier":
                        var lstsuppliers = JSON.parse(sessionStorage.getItem("lstSupplier"));
                        lstsuppliers.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.supplierId;
                            opt.innerHTML = x.supplierName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "FuelCard":
                        var lstFuelCard = JSON.parse(sessionStorage.getItem("lstFuelCard"));
                        lstFuelCard.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.cardId;
                            opt.innerHTML = x.cardNo;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "GensetFuelCard":
                        var lstGensetFuelCard = JSON.parse(sessionStorage.getItem("lstGensetFuelCard"));
                        lstGensetFuelCard.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.cardId;
                            opt.innerHTML = x.cardNo;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "ExpenseHead":
                        var lstExpenseHeads = JSON.parse(sessionStorage.getItem("lstExpense"));
                        lstExpenseHeads.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.expenseId;
                            opt.innerHTML = x.expenseName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Charge":
                        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
                        lstCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.acId;
                            opt.innerHTML = x.acName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "AccCharge":
                        var lstCharges = JSON.parse(sessionStorage.getItem("lstAccCharge"));
                        lstCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.chargeId;
                            opt.innerHTML = x.chargeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Route":
                        var lstRoutes = JSON.parse(sessionStorage.getItem("lstRoute"));
                        lstRoutes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.routeId;
                            opt.innerHTML = x.routeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "RouteGroup":
                        var lstRouteGroups = JSON.parse(sessionStorage.getItem("lstRouteGroup"));
                        lstRouteGroups.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.routeGroupId;
                            opt.innerHTML = x.routeGroupName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Consignee":
                        var lstConsignes = JSON.parse(sessionStorage.getItem("lstConsignee"));
                        lstConsignes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.consigneeId;
                            opt.innerHTML = x.consigneeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "VehicleCapacity":
                        var lstCapacities = JSON.parse(sessionStorage.getItem("lstCapacity"));
                        lstCapacities.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.capacityId;
                            opt.innerHTML = x.capacityName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "VehicleGroup":
                        var lstVehicleGroups = JSON.parse(sessionStorage.getItem("lstVehicleGroup"));
                        lstVehicleGroups.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.groupId;
                            opt.innerHTML = x.groupName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "DocumentType":
                        var lstDocumentType = JSON.parse(sessionStorage.getItem("lstDocumentType"));
                        lstDocumentType.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "ChargeMode":
                        var lstChargeModes = JSON.parse(sessionStorage.getItem("lstChargeMode"));
                        lstChargeModes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.id;
                            opt.innerHTML = x.name;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "WayType":
                        var lstWayType = JSON.parse(sessionStorage.getItem("lstWayType"));
                        lstWayType.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.id;
                            opt.innerHTML = x.name;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Account":
                        var lstAccounts = JSON.parse(sessionStorage.getItem("lstAccount"));
                        lstAccounts.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.accountId;
                            opt.innerHTML = x.accountName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "FreightType":
                        var lstFreightTypes = JSON.parse(sessionStorage.getItem("lstFreightType"));
                        lstFreightTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.id;
                            opt.innerHTML = x.name;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Training":
                        var lstTraining = JSON.parse(sessionStorage.getItem("lstTraining"));
                        lstTraining.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.trainingId;
                            opt.innerHTML = x.trainingName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Trainer":
                        var lstTrainer = JSON.parse(sessionStorage.getItem("lstTrainer"));
                        lstTrainer.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.trainerId;
                            opt.innerHTML = x.trainerName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "UOM":
                        var lstUOMs = JSON.parse(sessionStorage.getItem("lstUOM"));
                        lstUOMs.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.uoMId;
                            opt.innerHTML = x.uoMName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "WOCharge":
                        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
                        lstCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.chargeId;
                            opt.innerHTML = x.chargeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "RWBCharge":
                        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
                        lstCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.chargeId;
                            opt.innerHTML = x.chargeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Detention":
                        var lstDetention = JSON.parse(sessionStorage.getItem("lstDetention"));
                        lstDetention.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.detentionId;
                            opt.innerHTML = x.detentionName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                }
                this.dropDown.value = params.value;
            }
            //catch (exception) { showErrorToast('Agility agGrid Select init: ' + exception); }
            catch (exception) {
                throw exception;
            }
        };
        AgilitySelect.prototype.getGui = function () {
            return this.dropDown;
        };
        AgilitySelect.prototype.afterGuiAttached = function () {
            if (this.dropDown)
                this.dropDown.focus();
        };
        AgilitySelect.prototype.getValue = function () {
            return this.dropDown.value;
        };
        AgilitySelect.prototype.isPopup = function () {
            return true;
        };
        return AgilitySelect;
    }
    static allowEdit(params) {
        return !params.node.isRowPinned();
    }
    static allowRateRowEdit(params) {
        return !params.node.isRowPinned() && params.node.data.action != "D";
    }
    ;
    //static allowChargeEdit(params) {
    //return !params.node.isRowPinned() && !params.node.data.locked;
    //}
    static formatNumbers(x) {
        if (x.value !== undefined && x.value != null) {
            var parts = x.value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    }
    static dateFormatter(params) {
        var dp = new common_1.DatePipe('en-GB');
        return dp.transform(params.value, 'd-MMM-yy');
        //return dp.transform(params.value, 'yyyy-MM-dd');
        //var dateAsString = params.data.date;
        //var dateParts = dateAsString.split('/');
        //return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2]}`;
    }
    static numberValueParser(params) {
        if (params != undefined && params != null)
            return Number(params.newValue);
    }
    static setGridDeleteFilter(gridApi) {
        try {
            gridApi.setFilterModel({ delete: { filter: 'false', filterType: 'text', type: 'equals' } });
        }
        catch (exception) {
            alert('setGridDeleteFilter: ' + exception);
        }
    }
    static setGridIsDeletedFilter(gridApi) {
        try {
            gridApi.setFilterModel({ isDeleted: { filter: 'false', filterType: 'text', type: 'equals' } });
        }
        catch (exception) {
            alert('setGridIsDeletedFilter: ' + exception);
        }
    }
    //#endregion
    //#region Lookup Names
    static getProductName(x) {
        if (x.node.rowPinned)
            return "";
        var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
        try {
            if (lstProduct != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstProduct.find(dt => { return dt.productId == x.value; }).productName;
                }
                else
                    return '---Select Product---';
            }
        }
        catch (exception) {
            alert('getProductName: ' + exception);
        }
    }
    static getSKUName(x) {
        if (x.node.rowPinned)
            return "";
        var lstSKU = JSON.parse(sessionStorage.getItem("lstSKU"));
        try {
            if (lstSKU != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstSKU.find(dt => { return dt.skuId == x.value; }).skuName;
                }
                else
                    return '---Select SKU---';
            }
        }
        catch (exception) {
            alert('getProductName: ' + exception);
        }
    }
    static getAssetName(x) {
        if (x.node.rowPinned)
            return "";
        var lstAsset = JSON.parse(sessionStorage.getItem("lstAsset"));
        try {
            if (lstAsset != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstAsset.find(dt => { return dt.assetId == x.value; }).assetNo;
                }
                else
                    return '---Select Asset---';
            }
        }
        catch (exception) {
            alert('getAssetName: ' + exception);
        }
    }
    static getDepartmentName(x) {
        if (x.node.rowPinned)
            return "";
        var lstDepartment = JSON.parse(sessionStorage.getItem("lstDepartment"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstDepartment.find(dt => { return dt.departmentId == x.value; }).departmentName;
            }
            else
                return '---Select Department---';
        }
        catch (exception) {
            alert('getDepartmentName: ' + exception);
        }
    }
    static getBranchName(x) {
        if (x.node.rowPinned)
            return "";
        var lstBranch = JSON.parse(sessionStorage.getItem("lstBranch"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstBranch.find(dt => { return dt.branchId == x.value; }).branchName;
            }
            else
                return '---Select Branch---';
        }
        catch (exception) {
            alert('getBranchName: ' + exception);
        }
    }
    static getInsDocName(x) {
        var lstInsuranceDocuments = JSON.parse(sessionStorage.getItem("lstDocumentType"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstInsuranceDocuments.find(dt => { return dt.documentId == x.value; }).documentName;
            }
            else
                return '---Select Document---';
        }
        catch (exception) {
            alert('getDocumentName: ' + exception);
        }
    }
    static getPaymentTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstPaymentTypes = JSON.parse(sessionStorage.getItem("lstPaymentType"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstPaymentTypes.find(dt => { return dt.paymentTypeId == x.value; }).paymentTypeName;
            }
            else
                return '---Select Payment Type---';
        }
        catch (exception) {
            alert('getPaymentTypeName: ' + exception);
        }
    }
    static getClientName(x) {
        if (x.node.rowPinned)
            return "";
        var lstClients = JSON.parse(sessionStorage.getItem("lstClient"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstClients.find(dt => { return dt.clientId == x.value; }).clientName;
            }
            else
                return '---Select Client---';
        }
        catch (exception) {
            alert('getClientName: ' + exception);
        }
    }
    static getDocumentType(x) {
        if (x.node.rowPinned)
            return "";
        var lstDocumentTypes = JSON.parse(sessionStorage.getItem("lstDocumentType"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstDocumentTypes.find(dt => { return dt.typeId == x.value; }).typeName;
            }
            else
                return '---Select Document Type---';
        }
        catch (exception) {
            alert('getDocumentType: ' + exception);
        }
    }
    static getRelationName(x) {
        if (x.node.rowPinned)
            return "";
        var lstRelations = JSON.parse(sessionStorage.getItem("lstRelation"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstRelations.find(dt => { return dt.relationId == x.value; }).relationName;
            }
            else
                return '---Select Relation---';
        }
        catch (exception) {
            alert('getRelation: ' + exception);
        }
    }
    static getMedicalTestName(x) {
        if (x.node.rowPinned)
            return "";
        var lstMedicalTest = JSON.parse(sessionStorage.getItem("lstMedicalTest"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstMedicalTest.find(dt => { return dt.testId == x.value; }).testName;
            }
            else
                return '---Select Medical Test---';
        }
        catch (exception) {
            alert('getMedicalTest: ' + exception);
        }
    }
    static getSupplierName(x) {
        if (x.node.rowPinned)
            return "";
        var lstSuppliers = JSON.parse(sessionStorage.getItem("lstSupplier"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstSuppliers.find(dt => { return dt.supplierId == x.value; }).supplierName;
            }
            else
                return '---Select Supplier---';
        }
        catch (exception) {
            alert('getSupplier: ' + exception);
        }
    }
    static getFuelCardName(x) {
        if (x.node.rowPinned)
            return "";
        var lstFuelCards = JSON.parse(sessionStorage.getItem("lstFuelCard"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstFuelCards.find(dt => { return dt.cardId == x.value; }).cardNo;
            }
            else
                return '---Select Fuel Card---';
        }
        catch (exception) {
            alert('getFuelCard: ' + exception);
        }
    }
    static getGensetFuelCardName(x) {
        if (x.node.rowPinned)
            return "";
        var lstGensetFuelCards = JSON.parse(sessionStorage.getItem("lstGensetFuelCard"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstGensetFuelCards.find(dt => { return dt.cardId == x.value; }).cardNo;
            }
            else
                return '---Select Fuel Card---';
        }
        catch (exception) {
            alert('getFuelCard: ' + exception);
        }
    }
    static getExpenseHeadName(x) {
        if (x.node.rowPinned)
            return "";
        var lstExpenseHeads = JSON.parse(sessionStorage.getItem("lstExpense"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstExpenseHeads.find(dt => { return dt.expenseId == x.value; }).expenseName;
            }
            else
                return '---Select Expense Head---';
        }
        catch (exception) {
            alert('getExpenseHead: ' + exception);
        }
    }
    static getChargeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstCharges.find(dt => { return dt.acId == x.value; }).acName;
            }
            else
                return '---Select Charge Type---';
        }
        catch (exception) {
            alert('getChargeType: ' + exception);
        }
    }
    static getAccChargeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstCharges = JSON.parse(sessionStorage.getItem("lstAccCharge"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstCharges.find(dt => { return dt.chargeId == x.value; }).chargeName;
            }
            else
                return '---Select Charge Type---';
        }
        catch (exception) {
            alert('getChargeType: ' + exception);
        }
    }
    //static getRWBChargeName(x) {
    //  if (x.node.rowPinned)
    //    return "";
    //  var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
    //  try {
    //    if (Number.isNaN(x.value)) {
    //      x.value = "";
    //    }
    //    //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
    //    if (x.value != undefined && x.value != "" && x.value != null) {
    //      return lstCharges.find(dt => { return dt.chargeId == x.value; }).chargeName;
    //    }
    //    else
    //      return '---Select Charge Type---';
    //  }
    //  catch (exception) {
    //    alert('getChargeType: ' + exception);
    //  }
    //}
    static getRouteName(x) {
        if (x.node.rowPinned)
            return "";
        var lstRoutes = JSON.parse(sessionStorage.getItem("lstRoute"));
        try {
            if (lstRoutes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstRoutes.find(dt => { return dt.routeId == x.value; }).routeName;
                }
                else
                    return '---Select Route---';
            }
        }
        catch (exception) {
            alert('getRoute: ' + exception);
        }
    }
    static getRouteGroupName(x) {
        if (x.node.rowPinned)
            return "";
        var lstRouteGroups = JSON.parse(sessionStorage.getItem("lstRouteGroup"));
        try {
            if (lstRouteGroups != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstRouteGroups.find(dt => { return dt.routeGroupId == x.value; }).routeGroupName;
                }
                else
                    return '---Select Route Group---';
            }
        }
        catch (exception) {
            alert('getRouteGroup: ' + exception);
        }
    }
    static getTrainingName(x) {
        if (x.node.rowPinned)
            return "";
        var lstTraining = JSON.parse(sessionStorage.getItem("lstTraining"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstTraining.find(dt => { return dt.trainingId == x.value; }).trainingName;
            }
            else
                return '---Select Training Title---';
        }
        catch (exception) {
            alert('getTrainingName: ' + exception);
        }
    }
    static getTrainerName(x) {
        if (x.node.rowPinned)
            return "";
        var lstTrainer = JSON.parse(sessionStorage.getItem("lstTrainer"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstTrainer.find(dt => { return dt.trainerId == x.value; }).trainerName;
            }
            else
                return '---Select Trainer---';
        }
        catch (exception) {
            alert('getTrainerName: ' + exception);
        }
    }
    static getConsigneeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstConsignees = JSON.parse(sessionStorage.getItem("lstConsignee"));
        try {
            if (lstConsignees != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstConsignees.find(dt => { return dt.consigneeId == x.value; }).consigneeName;
                }
                else
                    return '---Select Consignee---';
            }
        }
        catch (exception) {
            alert('getConsignee: ' + exception);
        }
    }
    static getVehicleGroupName(x) {
        if (x.node.rowPinned)
            return "";
        var lstVehicleGroups = JSON.parse(sessionStorage.getItem("lstVehicleGroup"));
        try {
            if (lstVehicleGroups != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstVehicleGroups.find(dt => { return dt.groupId == x.value; }).groupName;
                }
                else
                    return '---Select VehicleGroup---';
            }
        }
        catch (exception) {
            alert('getVehicleGroup: ' + exception);
        }
    }
    static getCapacityName(x) {
        if (x.node.rowPinned)
            return "";
        var lstCapacity = JSON.parse(sessionStorage.getItem("lstCapacity"));
        try {
            if (lstCapacity != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCapacity.find(dt => { return dt.capacityId == x.value; }).capacityName;
                }
                else
                    return '---Select Vehicle Capacity---';
            }
        }
        catch (exception) {
            alert('getCapacity: ' + exception);
        }
    }
    static getInvFormatName(x) {
        if (x.node.rowPinned)
            return "";
        var lstInvoiceFormat = JSON.parse(sessionStorage.getItem("lstInvoiceFormat"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstInvoiceFormat.find(dt => { return dt.formatId == x.value; }).formatName;
            }
            else
                return '---Select Invoice Format---';
        }
        catch (exception) {
            alert('getInvFormatName: ' + exception);
        }
    }
    static getChargeModeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstChargeModes = JSON.parse(sessionStorage.getItem("lstChargeMode"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstChargeModes.find(dt => { return dt.id == x.value; }).name;
            }
            else
                return '---Select Charge Mode---';
        }
        catch (exception) {
            alert('getChargeMode: ' + exception);
        }
    }
    static getWayTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstWayType = JSON.parse(sessionStorage.getItem("lstWayType"));
        try {
            if (lstWayType != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstWayType.find(dt => { return dt.id == x.value; }).name;
                }
                else
                    return '---Select Way Mode---';
            }
        }
        catch (exception) {
            alert('getWayType: ' + exception);
        }
    }
    static getAccountName(x) {
        if (x.node.rowPinned)
            return "";
        var lstAccounts = JSON.parse(sessionStorage.getItem("lstAccount"));
        try {
            if (Number.isNaN(x.value)) {
                x.value = "";
            }
            //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
            if (x.value != undefined && x.value != "" && x.value != null) {
                return lstAccounts.find(dt => { return dt.accountId == x.value; }).accountName;
            }
            else
                return '---Select Account---';
        }
        catch (exception) {
            alert('getAccount: ' + exception);
        }
    }
    static getFreightTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstFreightTypes = JSON.parse(sessionStorage.getItem("lstFreightType"));
        try {
            if (lstFreightTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstFreightTypes.find(dt => { return dt.id == x.value; }).name;
                }
                else
                    return '---Select FreightType---';
            }
        }
        catch (exception) {
            alert('getFreightTypet: ' + exception);
        }
    }
    static getUoMName(x) {
        var lstUoMS = JSON.parse(sessionStorage.getItem("lstUOM"));
        try {
            if (lstUoMS != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstUoMS.find(dt => { return dt.uoMId == x.value; }).uoMName;
                }
                else
                    return '---Select UOM---';
            }
        }
        catch (exception) {
            alert('getUOM: ' + exception);
        }
    }
    static getWOChargeName(x) {
        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
        try {
            if (lstCharges != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCharges.find(dt => { return dt.chargeId == x.value; }).chargeName;
                }
                else
                    return '---Select Charge---';
            }
        }
        catch (exception) {
            alert('getCharge: ' + exception);
        }
    }
    static getDetentionName(x) {
        if (x.node.rowPinned)
            return "";
        var lstDetention = JSON.parse(sessionStorage.getItem("lstDetention"));
        try {
            if (lstDetention != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstDetention.find(dt => { return dt.detentionId == x.value; }).detentionName;
                }
                else
                    return '---Select Detention Slab---';
            }
        }
        catch (exception) {
            alert('getDetention: ' + exception);
        }
    }
    static showDate(x) {
        let datePipe;
        return datePipe.transform(x.value, 'dd-MMM-yy');
    }
};
agGridHelper = __decorate([
    core_1.Injectable({ providedIn: 'root' })
], agGridHelper);
exports.agGridHelper = agGridHelper;
//#endregion
//case "NonInventoryProduct":
//var lstNonInventoryProduct = JSON.parse(sessionStorage.getItem("lstNonInventoryProduct"));
//lstNonInventoryProduct.forEach(x => {
//  var opt = document.createElement('option');
//  opt.value = x.nonInventoryProductId;
//  opt.innerHTML = x.nonInventoryProductName;
//  this.dropDown.appendChild(opt);
//});
//break;
//          case "SubContractor":
//var lstSubContractor = JSON.parse(sessionStorage.getItem("lstSubContractor"));
//lstSubContractor.forEach(x => {
//  var opt = document.createElement('option');
//  opt.value = x.subContractorId;
//  opt.innerHTML = x.subContractorName;
//  this.dropDown.appendChild(opt);
//});
//break;
//          case "SubContractorType":
//var lstSubContractorType = JSON.parse(sessionStorage.getItem("lstSubContractorType"));
//lstSubContractorType.forEach(x => {
//  var opt = document.createElement('option');
//  opt.value = x.typeId;
//  opt.innerHTML = x.typeName;
//  this.dropDown.appendChild(opt);
//});
//break;
//          case "Technician":
//var lstTechnician = JSON.parse(sessionStorage.getItem("lstTechnician"));
//lstTechnician.forEach(x => {
//  var opt = document.createElement('option');
//  opt.value = x.technicianId;
//  opt.innerHTML = x.technicianName;
//  this.dropDown.appendChild(opt);
//});
//break;
//          case "TechnicianType":
//var lstTechnicianType = JSON.parse(sessionStorage.getItem("lstTechnicianType"));
//lstTechnicianType.forEach(x => {
//  var opt = document.createElement('option');
//  opt.value = x.typeId;
//  opt.innerHTML = x.typeName;
//  this.dropDown.appendChild(opt);
//});
//break;
//  static getNonInventoryProductName(x) {
//  var lstNonInventoryProduct = JSON.parse(sessionStorage.getItem("lstNonInventoryProduct"));
//  try {
//    if (lstNonInventoryProduct != null) {
//      if (Number.isNaN(x.value)) {
//        x.value = "";
//      }
//      //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
//      if (x.value != undefined && x.value != "" && x.value != null) {
//        return lstNonInventoryProduct.find(dt => { return dt.nonInventoryProductId == x.value; }).nonInventoryProductName;
//      }
//      else
//        return '---Select NonInventoryProduct---';
//    }
//  }
//  catch (exception) {
//    alert('getNonInventoryProductName: ' + exception);
//  }
//}
//  static getSubContractorName(x) {
//  var lstSubContractor = JSON.parse(sessionStorage.getItem("lstSubContractor"));
//  try {
//    if (lstSubContractor != null) {
//      if (Number.isNaN(x.value)) {
//        x.value = "";
//      }
//      //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
//      if (x.value != undefined && x.value != "" && x.value != null) {
//        return lstSubContractor.find(dt => { return dt.subContractorId == x.value; }).subContractorName;
//      }
//      else
//        return '---Select SubContractor---';
//    }
//  }
//  catch (exception) {
//    alert('getSubContractorName: ' + exception);
//  }
//}
//  static getSubContractorTypeName(x) {
//  var lstSubContractorType = JSON.parse(sessionStorage.getItem("lstSubContractorType"));
//  try {
//    if (lstSubContractorType != null) {
//      if (Number.isNaN(x.value)) {
//        x.value = "";
//      }
//      //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
//      if (x.value != undefined && x.value != "" && x.value != null) {
//        return lstSubContractorType.find(dt => { return dt.typeId == x.value; }).typeName;
//      }
//      else
//        return '---Select SubContractorType---';
//    }
//  }
//  catch (exception) {
//    alert('getSubContractorTypeName: ' + exception);
//  }
//}
//  static getTechnicianName(x) {
//  var lstTechnician = JSON.parse(sessionStorage.getItem("lstTechnician"));
//  try {
//    if (lstTechnician != null) {
//      if (Number.isNaN(x.value)) {
//        x.value = "";
//      }
//      //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
//      if (x.value != undefined && x.value != "" && x.value != null) {
//        return lstTechnician.find(dt => { return dt.technicianId == x.value; }).technicianName;
//      }
//      else
//        return '---Select Technician---';
//    }
//  }
//  catch (exception) {
//    alert('getTechnicianName: ' + exception);
//  }
//}
//  static getTechnicianTypeName(x) {
//  var lstTechnicianType = JSON.parse(sessionStorage.getItem("lstTechnicianType"));
//  try {
//    if (lstTechnicianType != null) {
//      if (Number.isNaN(x.value)) {
//        x.value = "";
//      }
//      //var data = JSON.parse(sessionStorage.getItem("lstProduct"));      
//      if (x.value != undefined && x.value != "" && x.value != null) {
//        return lstTechnicianType.find(dt => { return dt.typeId == x.value; }).typeName;
//      }
//      else
//        return '---Select Technician Type---';
//    }
//  }
//  catch (exception) {
//    alert('getTechnicianName: ' + exception);
//  }
//}
//# sourceMappingURL=agGridHelper.js.map