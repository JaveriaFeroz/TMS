"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripExpenseSummaryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let TripExpenseSummaryComponent = class TripExpenseSummaryComponent {
    constructor(router, formbulider, svcTripExpense, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcTripExpense = svcTripExpense;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Trip Expense Data Extract';
        this.model = {};
        this.errors = [];
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        //#region grid setup
        //#region Trip Expense Grid Definition & functions
        this.colTripExpense = [
            {
                headerName: "Job #", field: "jobNo", editable: false, width: 100
            },
            {
                headerName: "StartDate ", field: "jobStartDate", editable: false, width: 100
            },
            {
                headerName: "EndDate ", field: "jobEndDate", editable: false, width: 100
            },
            {
                headerName: "Rwb #", field: "rwbNo", editable: false, width: 100
            },
            {
                headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
            },
            {
                headerName: "Invoice#", field: "invoiceNo", editable: false, width: 100
            },
            {
                headerName: "KMs", field: "kMs", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Fuel Ltrs ", field: "fuelLtrs", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Dept", field: "departure", editable: false, width: 140
            },
            {
                headerName: "DeptFromBase", field: "baseDepartureDateTime", editable: false, width: 140
            },
            {
                headerName: "Arrival", field: "arrivalDateTime", editable: false, width: 140
            },
            {
                headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 140
            },
            {
                headerName: "Route", field: "routeName", editable: false, width: 100
            },
            {
                headerName: "Client", field: "clientName", editable: false, width: 100
            },
            {
                headerName: "TripRevenue", field: "tripRevenue", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "TollTax", field: "tollTax", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Food", field: "food", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "DriverIncentive", field: "driverIncentive", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Misc", field: "miscellaneous", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "UnReceipted", field: "unReceipted", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Fuel", field: "fuel", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OutSourcedVehicle", field: "outSourcedVehicle", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Penalty", field: "penalty", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Loading", field: "loading", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Offloading", field: "offloading", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "OnRouteMaintainance", field: "onRouteMaintainance", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "HSSEIncentive", field: "hsseIncentive", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "OutsourceDetention", field: "outsourceDetention", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Expense Amt ", field: "totalCost", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
        ];
        this.initGrid();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmTripExpense = this.formbulider.group({
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]]
        });
        this.frmTripExpense.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.tripExpenseData = [];
    }
    //#region toolbar functions
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbUndo() {
        this.initForm();
    }
    tbLoad() {
        this.svcWaitDlg.open({});
        try {
            var formData = this.frmTripExpense.getRawValue();
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                return;
            }
            else {
                this.svcTripExpense.get(formData.dateFrom, formData.dateTo).subscribe(tripexpense => {
                    if (Object.keys(tripexpense).length > 0) {
                        this.tripExpenseData = tripexpense;
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
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
            this.extractTripExpenseData = this.getDataFromGrid();
            if (Object.keys(this.extractTripExpenseData).length > 0) {
                this.ExportDatatoExcel(this.extractTripExpenseData, 'TripExpense.xlsx');
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
        this.goTripExpense.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goTripExpense = {
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
        this.frmTripExpense.reset();
        this.frmTripExpense.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.errors = [];
        this.tripExpenseData = [];
        this.extractTripExpenseData = [];
    }
};
TripExpenseSummaryComponent = __decorate([
    core_1.Component({
        selector: 'app-tripexpensesummary',
        templateUrl: './tripexpensesummary.component.html',
        styleUrls: ['./tripexpensesummary.component.css']
    })
], TripExpenseSummaryComponent);
exports.TripExpenseSummaryComponent = TripExpenseSummaryComponent;
//# sourceMappingURL=tripexpensesummary.component.js.map