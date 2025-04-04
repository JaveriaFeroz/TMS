"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let ClientRateComponent = class ClientRateComponent {
    //#endregion
    constructor(router, formbulider, svcToaster, svcClientRate, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcToaster = svcToaster;
        this.svcClientRate = svcClientRate;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Client Rate';
        this.minDate = new Date().setDate(new Date().getDate() - 365);
        this.maxDate = new Date().setDate(new Date().getDate() + 730);
        this.lstWayType = [
            { id: 1, name: 'One Way' },
            { id: 2, name: 'Two Way' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.frameworkComponents = { agDateEditor: agGrid_date_component_1.agGridDateEditor };
        this.colSearch = [
            { headerName: 'Id', field: 'clientId', width: 70 },
            { headerName: 'Client Name', field: 'clientName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.colHistory = [
            { headerName: 'Sender', field: 'sender' },
            { headerName: 'Recipient', field: 'recipient' },
            { headerName: 'State', field: 'status' },
            { headerName: 'Activity Date', field: 'activityDate' },
            { headerName: 'Comments', field: 'remarks' },
        ];
        //#endregion toolbar functions
        //#region grid setup
        //#region dedicated rent Grid Definition & functions
        this.colDedicatedRent = [
            {
                headerName: 'Fixed Monthly Rental',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle #", field: "vehicleNo", width: 90 },
                    { headerName: "Vehicle Group", field: "vehicleGroupName", width: 100 },
                    { headerName: "Month Chgs", field: "amount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, width: 110 },
                    { headerName: 'Pro-Rate', field: 'proRate', width: 90 }
                ]
            }
        ];
        //#endregion
        //#region dedicated variable Grid Definition & functions
        this.colDedicatedVar = [
            {
                headerName: 'Variable Charges (Running)',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle Capacity", field: "capacityName", width: 120 },
                    { headerName: "Apply Std KM", field: "applyStdKM", width: 90 },
                    { headerName: "Rate/KM", field: "rate", type: "numericColumn", width: 90 }
                ]
            }
        ];
        //#endregion
        //#region dedicated KMs Grid Definition & functions
        this.colDedicatedKM = [
            {
                headerName: 'Route-wise Agreed Distance',
                children: [
                    { headerName: "Route", field: "routeName", width: 140 },
                    { headerName: "Route Group", field: "routeGroupName", width: 140 },
                    { headerName: "Distance (KM)", field: "distance", type: "numericColumn", width: 110 }
                ]
            }
        ];
        //#endregion
        //#region dedicated toll tax Grid Definition & functions
        this.colDedicatedToll = [
            {
                headerName: 'Fixed Agreed Toll Tax',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Toll/KM", field: "tollPerKM", type: "numericColumn", width: 70 }
                ]
            }
        ];
        //#endregion
        //#region Detention Grid Definition & functions
        this.colDetention = [
            {
                headerName: 'Detention Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle Capacity", field: "capacityName", width: 120 },
                    { headerName: "Detention Desc", field: "detentionName", width: 120 },
                    { headerName: "Amount", field: "amount", type: "numericColumn", width: 100 }
                ]
            }
        ];
        //#endregion
        //#region Handling Grid Definition & functions
        this.colHandling = [
            {
                headerName: 'Handling Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle Capacity", field: "capacityName", width: 135 },
                    {
                        headerName: "Ldg Chgs", field: "loadingChgs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, headerTooltip: "Loading Charges"
                    },
                    {
                        headerName: "Off Ldg Chgs", field: "offLoadingChgs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 125, headerTooltip: "Off Loading Charges"
                    }
                ]
            }
        ];
        //#endregion
        //#region Trip basis Grid Definition & functions
        this.colTrip = [
            {
                headerName: 'Trip Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle Capacity", field: "capacityName", width: 120 },
                    { headerName: "Route", field: "routeName", width: 150 },
                    { headerName: "Rate", field: "rate", type: "numericColumn", width: 90 },
                    { headerName: "Rate Ex.Wt/Kg", field: "rateExWtKg", type: "numericColumn", width: 90 }
                ]
            }
        ];
        //#endregion
        //#region Trip Tonnage Definition & functions
        this.colTripTon = [
            {
                headerName: 'Trip Charges',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Vehicle Capacity", field: "capacityName", width: 120 },
                    { headerName: "Route", field: "routeName", width: 150 },
                    { headerName: "Way Type", field: "wayTypeName", width: 100 },
                    { headerName: "Weight From", field: "weightFrom", type: "numericColumn", width: 90 },
                    { headerName: "Weight To", field: "weightTo", type: "numericColumn", width: 90 },
                    { headerName: "Rate", field: "rate", type: "numericColumn", width: 90 }
                ]
            }
        ];
        //#endregion
        //#region Freight KL Ton Grid Definition & functions
        this.colKLTon = [
            {
                headerName: 'Charges By Freight Type',
                children: [
                    { headerName: "Eff Date", field: "fromDate", width: 105 },
                    { headerName: "Freight Type", field: "freightTypeName", width: 120 },
                    { headerName: "Route", field: "routeName", width: 150 },
                    { headerName: "Rate", field: "tonRate", type: "numericColumn", width: 90 }
                ]
            }
        ];
        //sessionStorage.removeItem("lstRoute");
        //sessionStorage.removeItem("lstAsset");
        //sessionStorage.removeItem("lstVehicleGroup");
        //sessionStorage.removeItem("lstRouteGroup");
        //sessionStorage.removeItem("lstConsignee");
        //sessionStorage.removeItem("lstVehicleType");
        //sessionStorage.removeItem("lstChargeMode");
        //sessionStorage.removeItem("lstWayType");
        //this.LoginUserId = null;
        //this.LoginUserId = sessionStorage.getItem("UserId");
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmClientRate = this.formbulider.group({
            clientId: [null, [forms_1.Validators.required]],
            rateTypeId: [null],
            rateTypeName: [null, [forms_1.Validators.required]],
            invoiceModeName: [null, [forms_1.Validators.required]],
            waiverTon: [null],
            maxInvAmount: [null],
            maxShipmentsPerInvoice: [null],
            detGraceHrs: [null],
            detGraceHRsFromRwb: [null],
            //loadingChgs: [null],
            //offloadingChgs: [null],
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
            //  DetentionByTime: [null],
            //  DistanceByConsignee: [null],
            //  StateName: [null],
            //  StateId: [null],
            //  Owner: [null],
            //  IsCompleted: [null],
        });
        this.frmClientRate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmClientRate.patchValue({ StateId: 0, StateName: 'New', IsCompleted: false });
        //this.ButtonVisibility(agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        //var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        //if (_formid > 0) {
        //  this.get(_formid)
        //}
    }
    //#region toolbar functions
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcClientRate.getClientRates().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Client", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.clientId);
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
        this.frmClientRate.controls.clientId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
    }
    tbEdit() {
        this.frmClientRate.enable();
        this.frmClientRate.controls.clientId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.rateTypeName.focus();
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion
    initGrid() {
        this.goDedicatedRent = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goDedicatedVar = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goDedicatedKM = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goDedicatedToll = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goDetention = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goHandling = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                sortable: true,
                filter: true,
                resizable: true,
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goTrip = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple',
        };
        this.goTripTon = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
        this.goKLTon = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple'
        };
    }
    //#endregion
    //#region local functions
    get(id) {
        this.svcWaitDlg.open({});
        try {
            this.svcClientRate.get(id).subscribe(cr => {
                if (cr) {
                    this.frmClientRate.disable();
                    this.frmClientRate.controls['clientId'].setValue(cr.clientId);
                    if (cr.rateTypeId == null) {
                        this.frmClientRate.controls['rateTypeId'].setValue(1);
                        this.frmClientRate.controls['rateTypeName'].setValue('NA');
                    }
                    else {
                        this.frmClientRate.controls['rateTypeId'].setValue(cr.rateTypeId);
                        this.frmClientRate.controls['rateTypeName'].setValue(cr.rateTypeName);
                    }
                    this.frmClientRate.controls['invoiceModeName'].setValue(cr.invoiceModeName);
                    this.frmClientRate.controls['waiverTon'].setValue(cr.waiverTon);
                    this.frmClientRate.controls['maxInvAmount'].setValue(cr.maxInvAmount);
                    this.frmClientRate.controls['maxShipmentsPerInvoice'].setValue(cr.maxShipmentsPerInvoice);
                    this.frmClientRate.controls['detGraceHrs'].setValue(cr.detGraceHrs);
                    this.frmClientRate.controls['detGraceHRsFromRwb'].setValue(cr.detGraceHRsFromRwb);
                    //this.frmClientRate.controls['loadingChgs'].setValue(cr.loadingChgs);
                    //this.frmClientRate.controls['offloadingChgs'].setValue(cr.offloadingChgs);
                    //this.frmClientRate.controls['DistanceByConsignee'].setValue(cr.distanceByConsignee);
                    this.frmClientRate.controls['invoiceByRoute'].setValue(cr.invoiceByRoute);
                    this.frmClientRate.controls['invoiceByCategory'].setValue(cr.invoiceByCategory);
                    this.frmClientRate.controls['invoiceByOrigin'].setValue(cr.invoiceByOrigin);
                    this.frmClientRate.controls['separateDetInv'].setValue(cr.separateDetInv);
                    this.frmClientRate.controls['separateOtherChgsInv'].setValue(cr.separateOtherChgsInv);
                    this.frmClientRate.controls['validateRoute'].setValue(cr.validateRoute);
                    this.frmClientRate.controls['validateVehicle'].setValue(cr.validateVehicle);
                    this.frmClientRate.controls['consigneeMandatory'].setValue(cr.consigneeMandatory);
                    this.frmClientRate.controls['categoryMandatory'].setValue(cr.categoryMandatory);
                    this.frmClientRate.controls['productMandatory'].setValue(cr.productMandatory);
                    this.frmClientRate.controls['invMandatoryOnPoD'].setValue(cr.invMandatoryOnPoD);
                    this.frmClientRate.controls['oBDMandatoryOnPoD'].setValue(cr.oBDMandatoryOnPoD);
                    this.frmClientRate.controls['shipmentNoMandatoryOnPoD'].setValue(cr.shipmentNoMandatoryOnPoD);
                    this.frmClientRate.controls['allowZeroRate'].setValue(cr.allowZeroRate);
                    //this.frmClientRate.controls['DetentionByTime'].setValue(cr.detentionByTime);
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
                    this.footer = cr.footer;
                    this.handlingData = cr.handling;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided parameter(s) or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcClientRate.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    onClientChanged() {
        this.get(this.frmClientRate.controls.clientId.value);
    }
    initForm() {
        this.frmClientRate.reset();
        this.frmClientRate.disable();
        this.errors = [];
        this.dedicatedVarData = [];
        this.dedicatedRentData = [];
        this.dedicatedKMData = [];
        this.dedicatedTollData = [];
        this.tripData = [];
        this.detentionData = [];
        this.handlingData = [];
        this.tripTonData = [];
        this.klTonData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('rateTypeName', { static: true })
], ClientRateComponent.prototype, "rateTypeName", void 0);
__decorate([
    core_1.ViewChild('clientId', { static: true })
], ClientRateComponent.prototype, "clientId", void 0);
ClientRateComponent = __decorate([
    core_1.Component({
        selector: 'app-clientrate',
        templateUrl: './clientrate.component.html',
        styleUrls: ['./clientrate.component.css']
    })
], ClientRateComponent);
exports.ClientRateComponent = ClientRateComponent;
//# sourceMappingURL=clientrate.component.js.map