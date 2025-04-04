"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseSummaryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let ExpenseSummaryComponent = class ExpenseSummaryComponent {
    constructor(router, formbulider, svcExpSummary, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcExpSummary = svcExpSummary;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Expense Summary Data Extract';
        this.model = {};
        this.errors = [];
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        //#region grid setup
        //#region PL Grid Definition & functions
        this.colExpenseSummary = [
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
                headerName: "DepartureDate", field: "departureDate", editable: false, width: 100
            },
            {
                headerName: "DeliveryDate", field: "deliveryDate", editable: false, width: 100
            },
            {
                headerName: "JobCompletionDate", field: "jobCompletionDate", editable: false, width: 100
            },
            {
                headerName: "JobStatus", field: "statusName", editable: false, width: 100
            },
            {
                headerName: "TripType", field: "tripType", editable: false, width: 100
            },
            {
                headerName: "CustomerOrderNo", field: "customerOrderNo", editable: false, width: 100
            },
            {
                headerName: "GatePassNo", field: "gatePassNo", editable: false, width: 100
            },
            {
                headerName: "VehicleType", field: "capacityName", editable: false, width: 100
            },
            {
                headerName: "Asset", field: "assetNo", editable: false, width: 100
            },
            {
                headerName: "Client", field: "clientName", editable: false, width: 100
            },
            {
                headerName: "ShipperName", field: "shipperName", editable: false, width: 100
            },
            {
                headerName: "ConsigneeName", field: "consigneeName", editable: false, width: 100
            },
            {
                headerName: "ActualDuration ", field: "tripDuration", type: "numericColumn", editable: false, width: 100
            },
            {
                headerName: "JobStartKms ", field: "jobStartKms", type: "numericColumn", editable: false, width: 100
            },
            {
                headerName: "JobEndKms ", field: "jobEndKms", type: "numericColumn", editable: false, width: 100
            },
            {
                headerName: "JobEndKmsPerKM ", field: "jobEndKmsPerKM", type: "numericColumn", editable: false, width: 100
            },
            {
                headerName: "FuelAvgPerKm  ", field: "fuelAvgPerKm", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "FuelPerKm  ", field: "fuelPerKm", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "FuelLitre   ", field: "fuelLtrs", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
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
                headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "Loading", field: "loading", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "RepairAndMaintenance", field: "repairAndMaintenance", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "WeighBridgeCharges", field: "weighBridgeCharges", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "DriverSpecialIncentive", field: "driverSpecialIncentive", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
            {
                headerName: "CashFuel", field: "cashFuel", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "CreditFuel", field: "creditFuel", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "TotalTripExpenseByCash", field: "totalTripExpenseByCash", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "ExpenseAmount ", field: "expenseAmount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "IsDisbursed", field: "isDisbursed", editable: false, width: 130
            },
        ];
        this.initGrid();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmExpenseSummary = this.formbulider.group({
            dateBasicId: ["0", [forms_1.Validators.required]],
            dateFrom: [null],
            dateTo: [null],
        });
        this.expensesummaryData = [];
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
            var formData = this.frmExpenseSummary.getRawValue();
            if (formData.dateBasisId == null) {
                this.svcToaster.showFailure('Please select valid Date Basis for date before submitting query for data extraction');
                return;
            }
            else if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                return;
            }
            else {
                this.svcExpSummary.get(formData.dateFrom, formData.dateTo, formData.dateBasisId).subscribe(expensesummary => {
                    if (Object.keys(expensesummary).length > 0) {
                        this.expensesummaryData = expensesummary;
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
            this.extractExpenseSummaryData = this.getDataFromGrid();
            if (Object.keys(this.extractExpenseSummaryData).length > 0) {
                this.ExportDatatoExcel(this.extractExpenseSummaryData, 'ExpenseSummary.xlsx');
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
        this.goExpenseSummary.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goExpenseSummary = {
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
        this.frmExpenseSummary.reset();
        this.frmExpenseSummary.patchValue({ dateBasicId: "0" });
        this.errors = [];
        this.extractExpenseSummaryData = [];
        this.expensesummaryData = [];
    }
};
ExpenseSummaryComponent = __decorate([
    core_1.Component({
        selector: 'app-expensesummary',
        templateUrl: './expensesummary.component.html',
        styleUrls: ['./expensesummary.component.css']
    })
], ExpenseSummaryComponent);
exports.ExpenseSummaryComponent = ExpenseSummaryComponent;
//# sourceMappingURL=expensesummary.component.js.map