"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WF_ClientRateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let WF_ClientRateComponent = class WF_ClientRateComponent {
    //#endregion
    constructor(router, formbulider, route, svcWFClientRate, svcToaster, Enum, svcWaitDlg, svcSearchDlg, svcAuth, svcHistoryDlg, svcRecipient, svcSubmission) {
        this.router = router;
        this.formbulider = formbulider;
        this.route = route;
        this.svcWFClientRate = svcWFClientRate;
        this.svcToaster = svcToaster;
        this.Enum = Enum;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcAuth = svcAuth;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.svcSubmission = svcSubmission;
        // #region form variables
        this.myForm = false;
        this.optionName = 'Client Rate Setup Request';
        this.lstWayType = [
            { id: 1, name: 'One Way' },
            { id: 2, name: 'Two Way' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.submissionButtonsStatus = "";
        this.minDate = new Date().setDate(new Date().getDate() - 365);
        this.maxDate = new Date().setDate(new Date().getDate() + 730);
        this.frameworkComponents = { 'agDateEditor': agGrid_date_component_1.agGridDateEditor };
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        this.colSearch = [
            { headerName: 'Id', field: 'formId', width: 70 },
            { headerName: 'Client Name', field: 'clientName' },
            { headerName: 'State', field: 'stateName' },
        ];
        //#endregion FormSubmission
        //#region grid setup
        //#region dedicated rent Grid Definition & functions
        this.colDedicatedRent = [
            {
                headerName: 'Fixed Monthly Rental',
                children: [
                    {
                        headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Vehicle #", field: "vehicleId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Asset', class: "85" }, valueFormatter: agGridHelper_1.agGridHelper.getAssetName, width: 85
                    },
                    {
                        headerName: "Vehicle Group", field: "vehicleGroupId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleGroup', class: "160" }, valueFormatter: agGridHelper_1.agGridHelper.getVehicleGroupName, width: 160
                    },
                    {
                        headerName: "Monthly Chgs", field: "amount", type: "numericColumn", width: 120,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddDR = function () {
            try {
                var res = this.goDedicatedRent.api.applyTransaction({
                    add: [{
                            fromDate: null, assetId: null, vehicleGroupId: null, amount: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goDedicatedRent.api.getDisplayedRowAtIndex(res.add[0].rowIndex).setSelected(true);
                this.goDedicatedRent.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure('Add Line: ', exception, 'error');
            }
        };
        //#endregion
        //#region dedicated variable Grid Definition & functions
        this.colDedicatedVar = [
            {
                headerName: 'Variable Charges (Running)',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 80, cellEditor: 'agDateEditor', valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
                    {
                        headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleCapacity', class: "125" }, valueFormatter: agGridHelper_1.agGridHelper.getCapacityName, width: 125
                    },
                    {
                        headerName: "Std KM?", field: "applyStdKM", width: 80, editable: false,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 70,
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddDV = function () {
            try {
                var res = this.goDedicatedVar.api.applyTransaction({
                    add: [{
                            fromDate: null, capacityId: null, applyStdKM: false, rate: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goDedicatedVar.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure('Add Line: ', exception, 'error');
            }
        };
        //#endregion
        //#region dedicated KMs Grid Definition & functions
        this.colDedicatedKM = [
            {
                headerName: 'Route-wise Agreed Distance',
                children: [
                    {
                        headerName: "Route", field: "routeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Route', class: "125" }, valueFormatter: agGridHelper_1.agGridHelper.getRouteName, width: 125
                    },
                    {
                        headerName: "Route Group", field: "routeGroupId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'RouteGroup', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getRouteGroupName, width: 140
                    },
                    {
                        headerName: "Dist(KM)", field: "distance", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddDKM = function () {
            try {
                var res = this.goDedicatedKM.api.applyTransaction({
                    add: [{
                            routeId: null, routeGroupId: null, distance: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goDedicatedKM.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "routeId" });
            }
            catch (exception) {
                this.svcToaster.showFailure('Add Line: ', exception, 'error');
            }
        };
        //#endregion
        //#region dedicated Tolltax Grid Definition & functions
        this.colDedicatedToll = [
            {
                headerName: 'Fixed Agreed Toll Tax',
                children: [
                    {
                        headerName: "Eff Date", field: "fromDate", width: 75, cellEditor: 'agDateEditor', valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Toll/KM", field: "tollPerKM", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 70,
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddToll = function () {
            try {
                var res = this.goDedicatedToll.api.applyTransaction({
                    add: [{
                            fromDate: null, tollPerKM: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goDedicatedToll.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Line:');
            }
        };
        //#endregion
        //#region Detention Grid Definition & functions
        this.colDetention = [
            {
                headerName: 'Detention Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 85, cellEditor: 'agDateEditor', valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
                    {
                        headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getCapacityName, width: 140
                    },
                    {
                        headerName: "Det Slab", field: "detentionId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Detention', class: "125" }, valueFormatter: agGridHelper_1.agGridHelper.getDetentionName, width: 125
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, headerTooltip: "Loading Charges"
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddDetention = function () {
            try {
                var res = this.goDetention.api.applyTransaction({
                    add: [{
                            fromDate: null, capacityId: null, detentionId: null, amount: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goDetention.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Detention Line: ');
            }
        };
        this.onDeleteDetention = function () {
            try {
                if (this.goDetention.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goDetention.api.getSelectedRows().forEach(x => x.delete = true);
                        this.goDetention.api.onFilterChanged();
                    }
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDetention.api);
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Detention error:');
            }
            catch (exception) {
                this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
            }
        };
        //#endregion
        //#region Handling Grid Definition & functions
        this.colHandling = [
            {
                headerName: 'Handling Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 85, cellEditor: 'agDateEditor', valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
                    {
                        headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getCapacityName, width: 140
                    },
                    {
                        headerName: "Ldg Chgs", field: "loadingChgs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, headerTooltip: "Loading Charges"
                    },
                    {
                        headerName: "Off Ldg Chgs", field: "offLoadingChgs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 125, headerTooltip: "Off Loading Charges"
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddHandling = function () {
            try {
                var res = this.goHandling.api.applyTransaction({
                    add: [{
                            fromDate: null, capacityId: null, loadingChgs: 0, offLoadingChgs: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goHandling.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Line Error: ');
            }
        };
        this.onDeleteHandling = function () {
            try {
                if (this.goHandling.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goHandling.api.getSelectedRows().forEach(x => x.delete = true);
                        this.goHandling.api.onFilterChanged();
                    }
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goHandling.api);
                }
                else
                    this.svcToaster.showFailure('', 'No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
            }
            catch (exception) {
                this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
            }
        };
        //#endregion
        //#region Trip basis Grid Definition & functions
        this.colTrip = [
            {
                headerName: 'Trip Charges',
                children: [
                    {
                        headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Route", field: "routeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getRouteName, width: 140
                    },
                    {
                        headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getCapacityName, width: 140
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 70,
                    },
                    {
                        headerName: "Rate (ex)", field: "rateExWtKg", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90, headerTooltip: "Rate/Kg for excess weight"
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddTrip = function () {
            try {
                var res = this.goTrip.api.applyTransaction({
                    add: [{
                            fromDate: null, routeId: null, capacityId: null, rate: 0, rateExWtKg: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goTrip.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Trip Charges Line: ');
            }
        };
        this.onDeleteTrip = function () {
            try {
                if (this.goTrip.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goTrip.api.getSelectedRows().forEach(x => x.delete = true);
                        this.goTrip.api.onFilterChanged();
                    }
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goTrip.api);
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
            }
            catch (exception) {
                this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
            }
        };
        //#endregion
        //#region Trip Tonnage Definition & functions
        this.colTripTon = [
            {
                headerName: 'Trip Charges',
                children: [
                    {
                        headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Route", field: "routeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getRouteName, width: 140
                    },
                    {
                        headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getCapacityName, width: 140
                    },
                    {
                        headerName: "Way Type", field: "wayTypeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'WayType', class: "100" }, valueFormatter: agGridHelper_1.agGridHelper.getWayTypeName, width: 100
                    },
                    {
                        headerName: "Wt. From", field: "weightFrom", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                    },
                    {
                        headerName: "Wt. To", field: "weightTo", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 70,
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddTripTon = function () {
            try {
                var res = this.goTripTon.api.applyTransaction({
                    add: [{
                            fromDate: null, routeId: null, capcityId: null, wayTypeId: 1, weightFrom: 0, weightTo: 0,
                            rate: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goTripTon.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Line Trip Ton: ');
            }
        };
        this.onDeleteTripTon = function () {
            try {
                if (this.goTripTon.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goTripTon.api.getSelectedRows().forEach(x => x.delete = true);
                        this.goTripTon.api.onFilterChanged();
                    }
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goTripTon.api);
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Trip Ton');
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Delete Line Item: ');
            }
        };
        //#endregion
        //#region Freight KL Ton Grid Definition & functions
        this.colKLTon = [
            {
                headerName: 'Charges By Freight Type',
                children: [
                    {
                        headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Route", field: "routeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getRouteName, width: 140
                    },
                    {
                        headerName: "Frt. Type", field: "freightTypeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'FreightType', class: "140" }, valueFormatter: agGridHelper_1.agGridHelper.getFreightTypeName, width: 140
                    },
                    {
                        headerName: "Rate/Ton", field: "tonRate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90,
                    },
                    { headerName: "A", field: "action", width: 40, filter: false, editable: false },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddKLTon = function () {
            try {
                var res = this.goKLTon.api.applyTransaction({
                    add: [{
                            fromDate: null, routeId: null, freightTypeId: null, tonRate: 0, add: true, edit: false, delete: false
                        }]
                });
                this.goKLTon.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add KL Ton Row');
            }
        };
        this.onDeleteKLTon = function () {
            try {
                if (this.goKLTon.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goKLTon.api.getSelectedRows().forEach(x => x.delete = true);
                        //this.goKLTon.api.onFilterChanged();
                        agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goKLTon.api);
                    }
                    //agGridHelper.setGridDeleteFilter(this.goKLTon.api);
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Delete KL Ton Row:');
            }
        };
        this.loadLookup();
        this.initGrid();
        this.currentUserId = svcAuth.getUserId();
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid > 0) {
            this.get(_formid);
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngOnInit() {
        this.frmWFClientRate = this.formbulider.group({
            formId: [null],
            clientId: [null, [forms_1.Validators.required]],
            rateTypeId: [null, [forms_1.Validators.required]],
            invoiceModeId: [null, [forms_1.Validators.required]],
            waiverTon: [null],
            maxInvAmount: [null],
            maxShipmentsPerInvoice: [null],
            detGraceHrs: [null],
            detGraceHRsFromRWB: [null],
            invoiceByRoute: [null],
            invoiceByCategory: [null],
            invoiceByOrigin: [null],
            separateDetInv: [null],
            separateOtherChgsInv: [null],
            validateRoute: [null],
            validateVehicle: [null],
            consigneeMandatory: [null],
            categoryMandatory: [null],
            productMandatory: [null],
            invMandatoryOnPoD: [null],
            oBDMandatoryOnPoD: [null],
            shipmentNoMandatoryOnPoD: [null],
            allowZeroRate: [null],
            stateId: [null],
            stateName: [null],
            owner: [null],
            completed: [null],
        });
        this.frmWFClientRate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmWFClientRate.patchValue({ stateId: 0, stateName: 'New', completed: false });
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar');
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmWFClientRate.reset();
        this.frmWFClientRate.enable();
        this.frmWFClientRate.controls.formId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmWFClientRate.patchValue({
            stateId: 0, completed: false, stateName: "New", owner: this.svcAuth.getUserId(), maxInvAmount: 0, maxShipmentsPerInvoice: 0,
            waiverTon: 0, detGraceHrs: 0, detGraceHRsFromRWB: false, invoiceByRoute: false, invoiceByOrigin: false, invoiceByCategory: false, separateDetInv: false,
            separateOtherChgsInv: false, validateRoute: false, validateVehicle: false, categoryMandatory: false, productMandatory: false,
            invMandatoryOnPoD: false, oBDMandatoryOnPoD: false, shipmentNoMandatoryOnPoD: false, allowZeroRate: false,
        });
        this.footer.createdBy = this.svcAuth.getUserId();
        this.clientId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWFClientRate.getClientRates().subscribe(r => {
                this.svcSearchDlg.open("Search & Select WIP Client Rate", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.formId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initForm();
        this.frmWFClientRate.controls.formId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.formId.nativeElement.focus();
    }
    tbEdit() {
        this.frmWFClientRate.enable();
        this.frmWFClientRate.controls.clientId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        var formData = this.frmWFClientRate.getRawValue();
        if (formData.rateTypeId != null) {
            this.frmWFClientRate.controls.invoiceModeId.disable();
            this.frmWFClientRate.controls.rateTypeId.disable();
        }
        if (formData.stateId > 1) {
            this.frmWFClientRate.controls.showPreviousRate.disable();
        }
        agFormHelper_1.agFormHelper.setGridStatus(true);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
    }
    tbSave() {
        try {
            this.frmWFClientRate.markAllAsTouched();
            if (!this.frmWFClientRate.invalid) {
                var formData = this.frmWFClientRate.getRawValue();
                switch (formData.rateTypeId) {
                    case 0:
                        formData.dedicatedRents = this.getDedicatedRentFromGrid();
                        formData.dedicatedVariables = this.getDedicatedVariableFromGrid();
                        formData.dedicatedKMs = this.getDedicatedKMFromGrid();
                        formData.dedicatedTollTax = this.getDedicatedTollFromGrid();
                        break;
                    case 1:
                        formData.trips = this.getTripFromGrid();
                        formData.detentions = this.getDetentionFromGrid();
                        break;
                    case 3:
                        formData.tripTonSlabs = this.getTripTonFromGrid();
                        formData.detentions = this.getDetentionFromGrid();
                        break;
                    case 6:
                        formData.freightKLTons = this.getKLTonFromGrid();
                        formData.detentions = this.getDetentionFromGrid();
                }
                formData.handling = this.getHandlingFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcWFClientRate.save(formData).subscribe(data => {
                        this.svcToaster.showSuccess('Client Rate Request # ' + data.formId + ' saved Successfully, click submit to progress this request further in the workflow!');
                        this.get(data.formId);
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        if (this.myForm)
            this.router.navigate(['common/MyForm']);
        else {
            this.initForm();
            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        }
    }
    tbExit() {
        if (this.myForm)
            this.router.navigate(['common/MyForm']);
        else
            this.router.navigate(['/MainForm']);
    }
    tbHistory(formId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(AgilityEnum_1.AgilityEnum.WorkFlow.RateSetup, formId).subscribe(r => {
                this.svcHistoryDlg.open("Rate Request # " + formId, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region FormSubmission - to be reviewed later
    tbFormSubmission(formId, stateId) {
        this.svcWaitDlg.open({});
        let recipients, nextStateId, submission = new submission_1.Submission();
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 2 || stateId == 5) {
                    recipients = this.svcRecipient.getClientRates(formId, stateId);
                }
                else {
                    recipients = this.svcRecipient.getOwner(AgilityEnum_1.AgilityEnum.WorkFlow.RateSetup, formId);
                }
                rxjs_1.forkJoin([recipients]).subscribe(results => {
                    var data = results[0];
                    if (stateId == 4 || stateId == 99) {
                        recipients = results[0];
                        nextStateId = stateId;
                    }
                    else {
                        recipients = data["recipient"];
                        nextStateId = data["nextState"];
                    }
                    if (recipients === undefined || recipients.length == 0) {
                        this.svcToaster.showWarning("No submission user(s) are configured for current State of this Form. " +
                            "Submission process can not continue while users are missing.");
                        this.svcWaitDlg.close();
                        return;
                    }
                    else {
                        this.svcSubmission.open("Client Rate Setup Request # " + formId, AgilityEnum_1.AgilityEnum.getClientRateState(nextStateId), recipients);
                        this.svcSubmission.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    submission.formId = formId;
                                    submission.comments = r.SubmissionComment;
                                    submission.owner = r.recipientId;
                                    submission.stateId = nextStateId;
                                    this.submit(submission);
                                }
                                else {
                                    this.svcToaster.showWarning("No submission user selected. Please select user to try again. " +
                                        "Submission process can not be executed while submission users are missing");
                                    return;
                                }
                            }
                        }, error => { this.svcWaitDlg.close(); this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); this.svcSubmission.close(); });
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                resolve(true);
            }
            catch (e) {
                this.svcWaitDlg.close();
                this.svcToaster.showFailure(e);
                reject(e);
            }
        });
    }
    submit(sub) {
        if (sub.stateId == 3) {
            sub.completed = true;
            sub.approved = true;
        }
        else if (sub.stateId == 4 || sub.stateId == 99) {
            sub.completed = true;
            sub.rejected = true;
            sub.approved = false;
        }
        this.svcWFClientRate.submit(sub).subscribe(() => {
            this.svcToaster.showSuccess('Client Rate Request # ' + sub.formId +
                ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.initForm();
            this.router.navigate(['/MainForm']);
        }, error => { this.svcToaster.showFailure(error); }, () => { });
    }
    onDeleteDR() {
        try {
            if (this.goDedicatedRent.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDedicatedRent.api.getSelectedRows().filter(y => !y.delete).forEach(x => x.delete = true);
                    this.goDedicatedRent.api.onFilterChanged();
                }
                agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDedicatedRent.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Error');
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Delete Line Item: ');
        }
    }
    ;
    getDedicatedRentFromGrid() {
        let rowData = [];
        this.goDedicatedRent.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onDeleteDV() {
        try {
            if (this.goDedicatedVar.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDedicatedVar.api.getSelectedRows().forEach(x => x.delete = true);
                    this.goDedicatedVar.api.onFilterChanged();
                }
                agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDedicatedVar.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Delete Line Item:');
        }
    }
    ;
    getDedicatedVariableFromGrid() {
        let rowData = [];
        this.goDedicatedVar.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onDeleteDKM() {
        try {
            if (this.goDedicatedKM.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDedicatedKM.api.getSelectedRows().forEach(x => x.delete = true);
                    this.goDedicatedKM.api.onFilterChanged();
                }
                agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDedicatedKM.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Delete Line Item: ');
        }
    }
    ;
    getDedicatedKMFromGrid() {
        let rowData = [];
        this.goDedicatedKM.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onDeleteToll() {
        try {
            if (this.goDedicatedToll.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDedicatedToll.api.getSelectedRows().forEach(x => x.delete = true);
                    this.goDedicatedToll.api.onFilterChanged(); //getFilterInstance('delete').onAnyFilterChanged();
                }
                agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDedicatedToll.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Delete Line Item:');
        }
    }
    ;
    getDedicatedTollFromGrid() {
        let rowData = [];
        this.goDedicatedToll.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getDetentionFromGrid() {
        let rowData = [];
        this.goDetention.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getHandlingFromGrid() {
        let rowData = [];
        this.goHandling.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getTripFromGrid() {
        let rowData = [];
        this.goTrip.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getTripTonFromGrid() {
        let rowData = [];
        this.goTripTon.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getKLTonFromGrid() {
        let rowData = [];
        this.goKLTon.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goDedicatedRent = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.cdetailId == null)
                    params.data.add = true;
                if (params.colDef.field == "vehicleId") {
                    params.node.setDataValue("vehicleId", parseInt(params.data.vehicleId));
                }
                if (params.colDef.field == "vehicleGroupId") {
                    params.node.setDataValue("vehicleGroupId", parseInt(params.data.vehicleGroupId));
                }
            },
        };
        this.goDedicatedVar = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "capacityId") {
                    params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
                }
            },
        };
        this.goDedicatedKM = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "routeId") {
                    if (params.data.routeId != "") {
                        params.node.setDataValue("routeId", parseInt(params.data.routeId));
                    }
                    else {
                        params.node.setDataValue("routeId", 0);
                    }
                }
                //if (params.colDef.field == "consigneeId") {
                //  params.node.setDataValue("consigneeId", parseInt(params.data.vehicleGroupId));
                //}
                if (params.colDef.field == "routeGroupId") {
                    if (params.data.routeId != "") {
                        params.node.setDataValue("routeGroupId", parseInt(params.data.routeGroupId));
                    }
                    else {
                        params.node.setDataValue("routeGroupId", 0);
                    }
                }
            },
        };
        this.goDedicatedToll = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
            },
        };
        this.goHandling = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "capacityId") {
                    params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
                }
            },
            onRowDataChanged: () => {
                //this grid is common among all rate types that's grid status is called from this grid as it will be loaded anyway
                agFormHelper_1.agFormHelper.setGridToolbar(false);
                agFormHelper_1.agFormHelper.setGridStatus(false);
            }
        };
        this.goTrip = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "routeId") {
                    params.node.setDataValue("routeId", parseInt(params.data.routeId));
                }
                if (params.colDef.field == "capacityId") {
                    params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
                }
            },
        };
        this.goDetention = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "capacityId") {
                    params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
                }
                if (params.colDef.field == "detentionId") {
                    params.node.setDataValue("detentionId", parseInt(params.data.detentionId));
                }
            },
        };
        this.goTripTon = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "routeId") {
                    params.node.setDataValue("routeId", parseInt(params.data.routeId));
                }
                if (params.colDef.field == "capacityId") {
                    params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
                }
                if (params.colDef.field == "wayTypeId") {
                    params.node.setDataValue("wayTypeId", parseInt(params.data.wayTypeId));
                }
            },
        };
        this.goKLTon = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowRateRowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.data.action === "D") {
                    return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.data.detailId != 0 && !params.data.add)
                    params.data.edit = true;
                if (params.data.detailId == null)
                    params.data.add = true;
                if (params.colDef.field == "routeId") {
                    params.node.setDataValue("routeId", parseInt(params.data.routeId));
                }
                if (params.colDef.field == "freightTypeId") {
                    params.node.setDataValue("freightTypeId", parseInt(params.data.freightTypeId));
                }
            },
        };
    }
    validateGridStatus() {
        var rd = this.isReadOnly();
        agFormHelper_1.agFormHelper.setGridStatus(!rd);
        agFormHelper_1.agFormHelper.setGridToolbar(!rd);
    }
    //#endregion
    //#region local functions
    get(id) {
        try {
            this.svcWFClientRate.get(id).subscribe(cr => {
                if (cr) {
                    this.setFormData(cr);
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                    this.disableSave();
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcWFClientRate.getLookup().subscribe(data => {
                this.lstRateType = data.lstRateType;
                this.lstClient = data.lstClient;
                this.lstInvoiceMode = data.lstInvoiceMode;
                sessionStorage.setItem("lstRoute", JSON.stringify(data.lstRoute));
                sessionStorage.setItem("lstAsset", JSON.stringify(data.lstAsset));
                sessionStorage.setItem("lstVehicleGroup", JSON.stringify(data.lstVehicleGroup));
                sessionStorage.setItem("lstRouteGroup", JSON.stringify(data.lstRouteGroup));
                sessionStorage.setItem("lstCapacity", JSON.stringify(data.lstCapacity));
                sessionStorage.setItem("lstWayType", JSON.stringify(this.lstWayType));
                sessionStorage.setItem("lstDetention", JSON.stringify(data.lstDetention));
                sessionStorage.setItem("lstFreightType", JSON.stringify(data.lstFreightType));
            }, error => {
                this.svcToaster.showFailure(error);
            }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //validation to be applied for multiple keys later
    validate(cr) {
        this.errors = [];
        if (cr.completed || (cr.stateName != 'New' && cr.stateName != 'Saved') || cr.owner != cr.footer.createdBy || cr.owner != this.svcAuth.getUserId()) {
            this.errors.push('No further changes can be made to this Client Rate at this stage!');
        }
        if (cr.invoiceByCategory && !cr.categoryMandatory) {
            this.errors.push('To enable category wise invoice, it is required that you also keep category field mandatory on RWB');
        }
        else if (cr.rateTypeId > 0 && (cr.validateVehicle)) {
            this.errors.push('Validation flag for Vehicle could only be turned on for Rate Type Dedicated Fleet');
        }
        else if (cr.rateTypeId != 3 && (cr.allowZeroRate)) {
            this.errors.push('Zero Rate could only be turned on for Rate Type Charge on Trip & Tonnage');
        }
        if (cr.rateTypeId == 0) {
            if (cr.dedicatedRents.filter(x => !x.delete).length == 0) {
                this.errors.push('Atleast one entry must exist in Fixed Monthly Rental grid to perform save operation');
            }
            else if (cr.dedicatedVariables.filter(x => !x.delete).length == 0) {
                this.errors.push('Atleast one entry must exist in Fixed Monthly variable charges grid to perform save operation');
            }
            else if (cr.dedicatedRents.some(x => !x.delete && x.amount < 0)) {
                this.errors.push('No rental in Fixed Montly Rent can contain less than zero values');
            }
            else if (cr.dedicatedVariables.length != 0) {
                var valueArr = cr.dedicatedVariables.filter(x => !x.delete).map(function (item) { return item.fromDate; });
                var isDuplicate = valueArr.some(function (item, idx) {
                    return valueArr.indexOf(item) != idx;
                });
                if (isDuplicate) {
                    this.errors.push('Effective Date Must be unique in Fixed Montly Variable');
                }
            }
            else if (cr.dedicatedVariables.some(x => !x.delete && x.rate <= 0)) {
                this.errors.push('Rate Per KM for Fixed Montly Variable can not contain zero or less values');
            }
            else if (cr.dedicatedKMs.some(x => !x.delete && x.distance <= 0)) {
                this.errors.push('Distance in Fixed Montly Distance Grid can not contain zero or less values');
            }
            else if (cr.dedicatedKMs.length != 0) {
                var valueArrN = cr.dedicatedKMs.filter(x => !x.delete).map(function (item) { return item.routeId; });
                var isDuplicate = valueArrN.some(function (item, idx) {
                    return valueArrN.indexOf(item) != idx;
                });
                if (isDuplicate) {
                    this.errors.push('Route Must be unique in Fixed Montly Distance');
                }
            }
        }
        else if (cr.rateTypeId == 1) {
            if (cr.trips.filter(x => !x.delete).length == 0) {
                this.errors.push('Atleast one entry must exist in Trip charges grid to perform save operation');
            }
            else if (cr.trips.length != 0) {
                var valueArr = cr.trips.filter(x => !x.delete).map(function (item) { return item.fromDate; });
                var isDuplicate = valueArr.some(function (item, idx) {
                    return valueArr.indexOf(item) != idx;
                });
                if (isDuplicate) {
                    this.errors.push('Effective Date Must be unique in Trip Charges');
                }
            }
            if (cr.trips.some(x => !x.delete && (x.rate <= 0 || x.rateExWtKg < 0))) {
                this.errors.push('Rate in Trip Charges can not contain zero or less values');
            }
            if (cr.trips.some(x => !x.delete && (!x.routeId || !x.capacityId))) {
                this.errors.push('Please select valid Route and vehicle Capacity for each entry in Trip Charges');
            }
        }
        else if (cr.rateTypeId == 3) {
            if (cr.tripTonSlabs.filter(x => !x.delete).length == 0) {
                this.errors.push('Atleast one entry must exist in Trip & Tonnage grid to perform save operation');
            }
            if (cr.tripTonSlabs.length != 0) {
                var valueArr = cr.tripTonSlabs.filter(x => !x.delete).map(function (item) { return item.fromDate; });
                var isDuplicate = valueArr.some(function (item, idx) {
                    return valueArr.indexOf(item) != idx;
                });
                if (isDuplicate) {
                    this.errors.push('Effective Date Must be unique in Trip Tonnage Charges');
                }
            }
            if (cr.tripTonSlabs.some(x => !x.delete && (x.weightFrom < 0 || x.weightTo <= 0 || x.rate <= 0))) {
                this.errors.push('Weight & Rate can not contain zero or less values in Trip &B Tonnage charges grid');
            }
            if (cr.tripTonSlabs.some(x => !x.delete && x.weightFrom > x.weightTo)) {
                this.errors.push('Weight From must be same or lesser than Weight To Trip &B Tonnage charges grid');
            }
            if (cr.tripTonSlabs.some(x => !x.delete && (!x.routeId || !x.capacityId || !x.wayTypeId))) {
                this.errors.push('Route, Vehicle capacity and Way Type is mandatory for Trip Tonnage Charges');
            }
        }
        else if (cr.rateTypeId == 6) {
            if (cr.freightKLTons.length == 0) {
                this.errors.push('Atleast one entry must exist in Freight KL/KM charges grid to perform save operation');
            }
            if (cr.freightKLTons.length != 0) {
                var valueArr = cr.freightKLTons.filter(x => !x.delete).map(function (item) { return item.fromDate; });
                var isDuplicate = valueArr.some(function (item, idx) {
                    return valueArr.indexOf(item) != idx;
                });
                if (isDuplicate) {
                    this.errors.push('Effective Date Must be unique in Freight KL/KM charges Grid');
                }
            }
            else if (cr.freightKLTons.some(x => !x.delete && x.tonRate <= 0)) {
                this.errors.push('No row in freight KL/KM charges can contain zero or less values in Rate');
            }
            else if (cr.freightKLTons.some(x => !x.delete && !x.routeId)) {
                this.errors.push('Selection of route is mandatory for each line item of Freight KL/KM charges grid');
            }
        }
        //#region detention
        if (cr.detentions.some(x => !x.delete && (!x.detentionId || !x.capacityId))) {
            this.errors.push('Detention Type & Vehicle Capacity can not be blank');
        }
        if (cr.detentions.some(x => !x.delete && x.amount <= 0)) {
            this.errors.push('Detention Charges can not contain zero or less values');
        }
        if (cr.detentions.filter(x => !x.delete).length > 0) {
            var detDuplicate = cr.detentions.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, capacityId: item.capacityId, detentionId: item.detentionId })).slice().sort();
            for (var i = 0; i < detDuplicate.length - 1; i++) {
                if (detDuplicate[i + 1]['fromDate'] === detDuplicate[i]['fromDate']) {
                    if (detDuplicate[i + 1]['capacityId'] === detDuplicate[i]['capacityId']) {
                        if (detDuplicate[i + 1]['detentionId'] === detDuplicate[i]['detentionId']) {
                            this.errors.push('Detention slabs must be unique for specific effective date and vehicle capacity!');
                            i = detDuplicate.length;
                        }
                    }
                }
            }
        }
        //#endregion detention
        //#region handling
        if (cr.handling.some(x => !x.delete && (!x.capacityId))) {
            this.errors.push('Vehicle Capacity can not be blank for handling data');
        }
        if (cr.handling.some(x => !x.delete && (x.loadingChgs < 0 || x.offLoadingChgs < 0 || (x.loadingChgs == 0 && x.offLoadingChgs == 0)))) {
            this.errors.push('Loading & Offloading charges can not contain zero or less than zero values');
        }
        if (cr.handling.filter(x => !x.delete).length > 0) {
            var hdlgDuplicate = cr.handling.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, capacityId: item.capacityId })).slice().sort();
            for (var i = 0; i < hdlgDuplicate.length - 1; i++) {
                if (hdlgDuplicate[i + 1]['fromDate'] === hdlgDuplicate[i]['fromDate']) {
                    if (hdlgDuplicate[i + 1]['capacityId'] === hdlgDuplicate[i]['capacityId']) {
                        this.errors.push('Handling entry must be unique for specific effective date and vehicle capacity!');
                        i = hdlgDuplicate.length;
                    }
                }
            }
        }
        //#endregion
    }
    getExistingRate(event) {
        var clientId = event.value;
        this.svcWaitDlg.open({});
        try {
            this.svcWFClientRate.getExistingRate(clientId).subscribe(cr => {
                if (cr.inProcessForm) {
                    this.svcToaster.showWarning("Client Rates Setup request is already in process for selected Client. Only one request could be active for one client at a time.");
                    this.frmWFClientRate.controls["clientId"].setValue(null);
                }
                else {
                    this.setFormData(cr, true);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
            }, error => {
                this.svcToaster.showFailure(error);
            }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmWFClientRate.reset();
        this.frmWFClientRate.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.dedicatedVarData = [];
        this.dedicatedRentData = [];
        this.dedicatedKMData = [];
        this.dedicatedTollData = [];
        this.handlingData = [];
        this.tripData = [];
        this.detentionData = [];
        this.tripTonData = [];
        this.klTonData = [];
        this.footer = new footer_1.agFooter();
        this.myForm = false;
    }
    setActionBarVisibility(formMode) {
        this.submissionButtonsStatus = (formMode != agFormHelper_1.agFormMode.ReadOnly && formMode != agFormHelper_1.agFormMode.Review) ? "disabled" : "";
    }
    isReadOnly() {
        return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    setFormData(cr, recall = false) {
        if (!recall) {
            this.frmWFClientRate.disable();
            this.frmWFClientRate.controls['formId'].setValue(cr.formId);
            this.frmWFClientRate.controls['clientId'].setValue(cr.clientId);
        }
        this.frmWFClientRate.controls['rateTypeId'].setValue(cr.rateTypeId);
        if (cr.rateTypeId != null) {
            this.frmWFClientRate.get('rateTypeId').disable();
        }
        this.frmWFClientRate.controls['invoiceModeId'].setValue(cr.invoiceModeId);
        this.frmWFClientRate.controls['waiverTon'].setValue(cr.waiverTon);
        this.frmWFClientRate.controls['maxInvAmount'].setValue(cr.maxInvAmount);
        this.frmWFClientRate.controls['maxShipmentsPerInvoice'].setValue(cr.maxShipmentsPerInvoice);
        this.frmWFClientRate.controls['detGraceHrs'].setValue(cr.detGraceHrs);
        this.frmWFClientRate.controls['detGraceHRsFromRWB'].setValue(cr.detGraceHRsFromRWB);
        this.frmWFClientRate.controls['invoiceByRoute'].setValue(cr.invoiceByRoute);
        this.frmWFClientRate.controls['invoiceByCategory'].setValue(cr.invoiceByCategory);
        this.frmWFClientRate.controls['invoiceByOrigin'].setValue(cr.invoiceByOrigin);
        this.frmWFClientRate.controls['separateDetInv'].setValue(cr.separateDetInv);
        this.frmWFClientRate.controls['separateOtherChgsInv'].setValue(cr.separateOtherChgsInv);
        this.frmWFClientRate.controls['validateRoute'].setValue(cr.validateRoute);
        this.frmWFClientRate.controls['validateVehicle'].setValue(cr.validateVehicle);
        this.frmWFClientRate.controls['categoryMandatory'].setValue(cr.categoryMandatory);
        this.frmWFClientRate.controls['productMandatory'].setValue(cr.productMandatory);
        this.frmWFClientRate.controls['invMandatoryOnPoD'].setValue(cr.invMandatoryOnPoD);
        this.frmWFClientRate.controls['oBDMandatoryOnPoD'].setValue(cr.oBDMandatoryOnPoD);
        this.frmWFClientRate.controls['shipmentNoMandatoryOnPoD'].setValue(cr.shipmentNoMandatoryOnPoD);
        this.frmWFClientRate.controls['allowZeroRate'].setValue(cr.allowZeroRate);
        if (!cr.stateId) {
            this.frmWFClientRate.controls['stateId'].setValue(0);
            this.frmWFClientRate.controls['stateName'].setValue(AgilityEnum_1.AgilityEnum.getClientRateState(0));
            this.frmWFClientRate.controls['completed'].setValue(false);
        }
        else {
            this.frmWFClientRate.controls['stateId'].setValue(cr.stateId);
            this.frmWFClientRate.controls['stateName'].setValue(cr.stateName); /*.stateName = this.Enum.RateStatus(cr.stateId);*/
            this.frmWFClientRate.controls['owner'].setValue(cr.owner);
            this.frmWFClientRate.controls['completed'].setValue(cr.completed);
        }
        switch (cr.rateTypeId) {
            case 0:
                this.dedicatedRentData = cr.dedicatedRents;
                this.dedicatedVarData = cr.dedicatedVariables;
                this.dedicatedKMData = cr.dedicatedKMs;
                this.dedicatedTollData = cr.dedicatedTollTax;
                break;
            case 1:
                this.tripData = cr.trips;
                this.detentionData = cr.detentions;
                break;
            case 3:
                this.tripTonData = cr.tripTonSlabs;
                this.detentionData = cr.detentions;
                break;
            case 6:
                this.klTonData = cr.freightKLTons;
                this.detentionData = cr.detentions;
                break;
        }
        this.handlingData = cr.handling;
        if (cr.formId != null) {
            this.footer = cr.footer;
        }
        else {
            this.footer.createdBy = this.svcAuth.getUserId();
        }
    }
};
__decorate([
    core_1.ViewChild('formId', { static: true })
], WF_ClientRateComponent.prototype, "formId", void 0);
__decorate([
    core_1.ViewChild('clientId', { static: true })
], WF_ClientRateComponent.prototype, "clientId", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], WF_ClientRateComponent.prototype, "btnEdit", void 0);
WF_ClientRateComponent = __decorate([
    core_1.Component({
        selector: 'app-wf_clientrate',
        templateUrl: './wf_clientrate.component.html',
        styleUrls: ['./wf_clientrate.component.css']
    })
], WF_ClientRateComponent);
exports.WF_ClientRateComponent = WF_ClientRateComponent;
//# sourceMappingURL=wf_clientrate.component.js.map