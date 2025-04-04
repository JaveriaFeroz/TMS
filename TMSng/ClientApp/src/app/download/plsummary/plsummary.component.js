"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLSummaryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let PLSummaryComponent = class PLSummaryComponent {
    constructor(router, formbulider, svcPLDownload, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcPLDownload = svcPLDownload;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Profit and Loss';
        //model: any = {};
        //frm: any;
        this.errors = [];
        this.enablePartialDelivery = false;
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region Route PL Grid Definition & functions
        this.colRoutePL = [
            {
                headerName: "JobOrder#", field: "jobNo", editable: false, width: 100
            },
            {
                headerName: "Rwb#", field: "rwbNo", editable: false, width: 100
            },
            {
                headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
            },
            {
                headerName: "JobCLoseate", field: "jobCompletionDate", editable: false, width: 140
            },
            {
                headerName: "Invoice#", field: "invoiceNo", editable: false, width: 100
            },
            {
                headerName: "Route", field: "routeName", editable: false, width: 100
            },
            {
                headerName: "Capacity", field: "capacityName", editable: false, width: 100
            },
            {
                headerName: "LeaseType", field: "leaseTypeName", editable: false, width: 100
            },
            //{
            //  headerName: "ClientId", field: "clientId", editable: false, width: 100
            //},
            {
                headerName: "ClientRef. No", field: "clientRef", editable: false, width: 100
            },
            {
                headerName: "Client", field: "clientNames", editable: false, width: 150
            },
            {
                headerName: "Asset", field: "assetNo", editable: false, width: 100
            },
            {
                headerName: "ActualDuration", field: "tripDuration", type: "numericColumn", editable: false, width: 150
            },
            {
                headerName: "TripRevenue", field: "tripRevenue", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "FuelCostPerKM ", field: "fuelCostPerKM", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "Distance", field: "distance", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "FuelCost", field: "fuelCost", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Weight", field: "weight", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TotalCost", field: "totalCost", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "NetRevenue", field: "netRevenue", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "KMPerLitre", field: "kmperLitre", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "FuelPerKm", field: "fuelPerKm", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "FuelLitre", field: "fuelLtrs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "Departure", field: "departureDateTime", editable: false, width: 150
            },
            {
                headerName: "DepartureFromBase", field: "baseDepartureDateTime", editable: false, width: 150
            },
            {
                headerName: "ArrivalAtCity", field: "cityArrivalDateTime", editable: false, width: 150
            },
            {
                headerName: "ArrivalAtClient", field: "arrivalDateTime", editable: false, width: 150
            },
            {
                headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 150
            },
            {
                headerName: "RwbStatus", field: "rwbStateName", editable: false, width: 100
            },
            {
                headerName: "DetHrs", field: "detentionHours", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TollTax", field: "tollTax", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Food", field: "food", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "DriverIncentive", field: "driverIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Misc", field: "miscellaneous", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "UnReceipted", field: "unReceipted", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Fuel", field: "fuel", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 150
            },
            {
                headerName: "Penalty", field: "penalty", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Loading", field: "loading", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Offloading", field: "offloading", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OnRouteMaint", field: "onRouteMaintainance", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 150
            },
            {
                headerName: "HSSEIncentive", field: "hsseIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 150
            },
            {
                headerName: "OutsourceDetention", field: "outsourceDetention", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 150
            },
            //{
            //  headerName: "Comments", field: "comments", editable: false, width: 130
            //},
            {
                headerName: "TransitTime", field: "transitTime", editable: false, width: 120
            },
        ];
        this.colConsigneePL = [
            {
                headerName: "Departure ", field: "departureDateTime", editable: false, width: 150
            },
            {
                headerName: "Rwb #", field: "rwbNo", editable: false, width: 100
            },
            {
                headerName: "JobOrder #", field: "jobNo", editable: false, width: 100
            },
            {
                headerName: "TripType", field: "tripType", editable: false, width: 100
            },
            {
                headerName: "Doc #", field: "customerOrderNo", editable: false, width: 100
            },
            {
                headerName: "GatePass #", field: "gatePassNo", editable: false, width: 100
            },
            {
                headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
            },
            {
                headerName: "Asset", field: "assetNo", editable: false, width: 100
            },
            {
                headerName: "ShipperName", field: "shipperName", editable: false, width: 100
            },
            {
                headerName: "ConsigneeName", field: "consigneeName", editable: false, width: 100
            },
            {
                headerName: "Capacity", field: "capacityName", editable: false, width: 100
            },
            {
                headerName: "ProductName", field: "productName", editable: false, width: 100
            },
            {
                headerName: "Load", field: "load", type: "numericColumn", editable: false, width: 100
            },
            {
                headerName: "ActualDuration", field: "tripDuration", type: "numericColumn", editable: false, width: 150
            },
            {
                headerName: "ClientRef. No", field: "clientRef", editable: false, width: 100
            },
            {
                headerName: "Client", field: "clientNames", editable: false, width: 150
            },
            {
                headerName: "JobStartKms", field: "jobStartKms", type: "numericColumn", editable: false, width: 110
            },
            {
                headerName: "JobEndKms", field: "jobEndKms", type: "numericColumn", editable: false, width: 110
            },
            {
                headerName: "JobEndKmsPerKM", field: "jobEndKmsPerKM", type: "numericColumn", editable: false, width: 110
            },
            {
                headerName: "FuelPerKm", field: "fuelPerKm", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "LeaseType", field: "leaseTypeName", editable: false, width: 100
            },
            {
                headerName: "ConsigneeRate", field: "consigneeRate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "TripRevenue", field: "tripRevenue", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 110
            },
            {
                headerName: "NetRevenue", field: "netRevenue", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 110
            },
            {
                headerName: "FuelLtr", field: "fuelLtrs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "FuelCostPerKM", field: "fuelCostPerKM", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 110
            },
            {
                headerName: "RwbStatus", field: "rwbStateName", editable: false, width: 100
            },
            {
                headerName: "JobStatus", field: "jobStateName", editable: false, width: 100
            },
            {
                headerName: "TollTax", field: "tollTax", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Food", field: "food", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "CashFuel", field: "fuel", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "CreditFuel", field: "creditFuel", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "UnReceipted", field: "unReceipted", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "DriverIncentive", field: "driverIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "RepairAndMaintenance", field: "onRouteMaintainance", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "Loading", field: "loading", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "WeighBridgeCharges", field: "weighBridgeCharges", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "DriverSpecialIncentive", field: "driverSpecialIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "Misc", field: "miscellaneous", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TajTollTax", field: "tajTollTax", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TajFood", field: "tajFood", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TajUnReceipted", field: "tajUnReceiptedExpense", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TajDriverIncentive", field: "tajDriverIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TajRepairAndMaintenance", field: "tajRepairMaintenance", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TajLoadingUnloadingCharges", field: "tajLoadingUnLoading", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TajDriverSpecialIncentive", field: "tajDriverSpecialIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "Taj Misc", field: "tajMisc", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "FuelCreditCash", field: "fuelCreditCash", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TotalTripExpenseByCash", field: "totalTripExpenseByCash", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 140
            },
            {
                headerName: "TripExpense", field: "expenseAmount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 110
            },
            {
                headerName: "KMPerLtr", field: "kmperLitre", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 150
            },
            {
                headerName: "Invoice#", field: "invoiceNo", editable: false, width: 100
            },
            {
                headerName: "JobCloseDate", field: "jobCompletionDate", editable: false, width: 140
            },
        ];
        this.enablePartialDelivery = agFormHelper_1.agFormHelper.enablePartialDelivery(); //data.enablePartialDelivery;
        this.period = agFormHelper_1.agFormHelper.opsPeriodId();
        this.initGrid();
        this.loadLookup();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmPLReport = this.formbulider.group({
            dataBasisId: ["0", [forms_1.Validators.required]],
            dateFrom: [null],
            dateTo: [null],
            jobPeriod: [null],
            enablePartialDelivery: [],
        });
        this.frmPLReport.patchValue({ dateFrom: new Date(), dateTo: new Date(), enablePartialDelivery: this.enablePartialDelivery, jobPeriod: this.period });
        this.routePLData = [];
        this.consigneePLData = [];
    }
    //#region toolbar functions
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbUndo() {
        this.initForm();
    }
    tbLoad() {
        try {
            this.frmPLReport.markAllAsTouched();
            var formData = this.frmPLReport.getRawValue();
            if (formData.dataBasisId == null) {
                this.svcToaster.showFailure('Please select valid Date Basis for date before submitting query for data extraction');
                return;
            }
            else if ((formData.dataBasisId == 0 || formData.dataBasisId == 1) && formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                return;
            }
            else if (formData.dataBasisId == 2 && formData.jobPeriod == null) {
                this.svcToaster.showFailure('Please enter valid job period before submitting extract request');
                return;
            }
            else {
                this.svcWaitDlg.open({});
                if (!this.enablePartialDelivery) {
                    this.svcPLDownload.GetRoutePL(formData.dateFrom, formData.dateTo, formData.jobPeriod, formData.dataBasisId).subscribe(profitloss => {
                        if (Object.keys(profitloss).length > 0) {
                            console.log(profitloss);
                            this.routePLData = profitloss;
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                        }
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
                if (this.enablePartialDelivery) {
                    this.svcPLDownload.GetConsigneePL(formData.dateFrom, formData.dateTo, formData.jobPeriod, formData.dataBasisId).subscribe(profitloss => {
                        if (Object.keys(profitloss).length > 0) {
                            this.consigneePLData = profitloss;
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                        }
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbExport() {
        try {
            if (!this.enablePartialDelivery) {
                this.extractPLData = this.getRoutePLDataFromGrid();
            }
            else {
                this.extractPLData = this.getConsigneePLDataFromGrid();
            }
            if (Object.keys(this.extractPLData).length > 0) {
                this.ExportDatatoExcel(this.extractPLData, 'Profit&Loss.xlsx');
            }
            else {
                this.svcToaster.showWarning('No record found with your provided key value ');
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    getRoutePLDataFromGrid() {
        let rowData = [];
        this.goRoutePL.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getConsigneePLDataFromGrid() {
        let rowData = [];
        this.goConsigneePL.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        if (!this.enablePartialDelivery) {
            this.goRoutePL = {
                headerHeight: 25,
                rowHeight: 32,
                animateRows: true,
                defaultColDef: {
                    editable: false,
                    sortable: true,
                    filter: true,
                    resizable: true
                },
            };
        }
        if (this.enablePartialDelivery) {
            this.goConsigneePL = {
                headerHeight: 25,
                rowHeight: 32,
                animateRows: true,
                defaultColDef: {
                    editable: false,
                    sortable: true,
                    filter: true,
                    resizable: true
                },
            };
        }
    }
    //#endregion
    //#region local functions
    ExportDatatoExcel(data, excelFileName) {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    saveAsExcelFile(buffer, fileName) {
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
    loadLookup() {
        try {
            this.svcPLDownload.getLookup().subscribe(data => {
                this.lstPeriod = data.lstPeriod;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmPLReport.reset();
        this.frmPLReport.patchValue({ dataBasisId: "0", dateFrom: new Date(), dateTo: new Date() });
        this.errors = [];
        this.routePLData = [];
        this.consigneePLData = [];
        //this.goRoutePL.api.setRowData([]);
    }
};
PLSummaryComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-plsummary',
        templateUrl: './plsummary.component.html',
        styleUrls: ['./plsummary.component.css']
    })
], PLSummaryComponent);
exports.PLSummaryComponent = PLSummaryComponent;
//# sourceMappingURL=plsummary.component.js.map