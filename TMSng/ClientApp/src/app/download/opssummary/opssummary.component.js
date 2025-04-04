"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpsSummaryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let OpsSummaryComponent = class OpsSummaryComponent {
    constructor(router, formbulider, svcOpsReport, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcOpsReport = svcOpsReport;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Operational MIS Data Extract';
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        //#region grid setup
        //#region OP Grid Definition & functions
        this.colOperational = [
            {
                headerName: "Job#", field: "jobNo", editable: false, width: 100
            },
            {
                headerName: "Rwb#", field: "rwbNo", editable: false, width: 100
            },
            {
                headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
            },
            {
                headerName: "ConsigName", field: "consigneeName", editable: false, width: 100
            },
            {
                headerName: "CustOrder", field: "shipperRefNo", editable: false, width: 100
            },
            {
                headerName: "CategoryName", field: "categoryName", editable: false, width: 100
            },
            {
                headerName: "InvoiceNo", field: "invoiceNo", editable: false
            },
            {
                headerName: "AssetNo", field: "assetNo", editable: false, width: 100
            },
            {
                headerName: "Trailer#", field: "trailerNo", editable: false, width: 100
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
            {
                headerName: "Client", field: "clientName", editable: false, width: 100
            },
            {
                headerName: "ClientRef#", field: "shipperRefNo2", editable: false, width: 100
            },
            {
                headerName: "Driver1 ", field: "driver1Name", editable: false, width: 100
            },
            {
                headerName: "Driver2", field: "driver2Name", editable: false, width: 100
            },
            {
                headerName: "Tonnage", field: "weight", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "ClientInv #", field: "clientInvoiceNo", editable: false, width: 100
            },
            {
                headerName: "Ship#", field: "shipmentNo", editable: false, width: 100
            },
            {
                headerName: "OBD#", field: "deliveryNo", editable: false, width: 100
            },
            {
                headerName: "KMs", field: "kMs", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "StdKms", field: "standardKMs", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "KMPerLtr", field: "kmperLitre", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "FuelPerKM", field: "fuelPerKM", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Departure ", field: "departureDateTime", editable: false, width: 130
            },
            {
                headerName: "DptFromBase", field: "baseDepartureDateTime", editable: false, width: 130
            },
            {
                headerName: "ArrivalAtDestination", field: "destArrivalDateTime", editable: false, width: 130
            },
            {
                headerName: "ArrivalAtClient", field: "arrivalDateTime", editable: false, width: 130
            },
            {
                headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 130
            },
            {
                headerName: "RwbStatus", field: "rwbStatusName", editable: false, width: 100
            },
            {
                headerName: "TotalExpense", field: "totalExpense", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TollTax", field: "tollTax", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Food", field: "food", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "DriverIncentive", field: "driverIncentive", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "Misc", field: "miscellaneous", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "UnReceipted", field: "unReceipted", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Fuel", field: "fuel", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Penalty", field: "penalty", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Loading", field: "loading", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Offloading", field: "offloading", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OnRouteMaint", field: "onRouteMaintainance", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "HSSEIncentive", field: "hsseIncentive", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OutsourceDet", field: "outsourceDetention", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
        ];
        this.initGrid();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmOperational = this.formbulider.group({
            //DateBasicId: [null, [Validators.required]],
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]]
            //JobPeriod: [null, [Validators.required]],    
        });
        this.frmOperational.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.operationalData = [];
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
            this.frmOperational.markAllAsTouched();
            this.svcWaitDlg.open({});
            var formData = this.frmOperational.getRawValue();
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                this.svcWaitDlg.close();
                return;
            }
            else {
                this.svcOpsReport.get(formData.dateFrom, formData.dateTo).subscribe(operationalData => {
                    if (Object.keys(operationalData).length > 0) {
                        this.operationalData = operationalData;
                        this.svcWaitDlg.close();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                        this.svcWaitDlg.close();
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbExport() {
        try {
            this.extractOperationalData = this.getDataFromGrid();
            if (Object.keys(this.extractOperationalData).length > 0) {
                this.ExportDatatoExcel(this.extractOperationalData, 'OperationalData.xlsx');
            }
            else {
                this.svcToaster.showWarning('No record found with your provided key value ');
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
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
    getDataFromGrid() {
        let rowData = [];
        this.goOperational.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goOperational = {
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
    //#endregion
    initForm() {
        this.frmOperational.reset();
        this.frmOperational.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        //this.errors = [];
        this.operationalData = [];
        this.extractOperationalData = [];
    }
};
OpsSummaryComponent = __decorate([
    core_1.Component({
        selector: 'app-opssummary',
        templateUrl: './opssummary.component.html',
        styleUrls: ['./opssummary.component.css']
    })
], OpsSummaryComponent);
exports.OpsSummaryComponent = OpsSummaryComponent;
//# sourceMappingURL=opssummary.component.js.map