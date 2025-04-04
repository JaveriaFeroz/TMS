"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditFuelComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let CreditFuelComponent = class CreditFuelComponent {
    constructor(router, formbulider, svcCreditFuel, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCreditFuel = svcCreditFuel;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Credit Fuel';
        this.errors = [];
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region CF Grid Definition & functions
        this.colFuel = [
            {
                headerName: "Slip #", field: "slipNo", editable: false, width: 80
            },
            {
                headerName: "Slip Date", field: "slipDate", editable: false, width: 100
            },
            {
                headerName: "Client", field: "clientName", editable: false, width: 250
            },
            {
                headerName: "Supplier", field: "supplierName", editable: false, width: 200
            },
            {
                headerName: "Job #", field: "jobNo", editable: false, width: 120
            },
            {
                headerName: "Status", field: "stateName", editable: false, width: 80
            },
            {
                headerName: "Asset #", field: "assetNo", editable: false, width: 80
            },
            {
                headerName: "Fuel Ltr", field: "litre",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 80
            },
            {
                headerName: "Amount", field: "amount",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 80
            },
        ];
        this.loadLookup();
        this.initGrid();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmCreditFuel = this.formbulider.group({
            //DateBasicId: [null, [Validators.required]],
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
            clientId: [null],
            supplierId: [null]
            //JobPeriod: [null],
        });
        this.frmCreditFuel.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.fuelData = [];
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
            var formData = this.frmCreditFuel.getRawValue();
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                return;
            }
            else {
                if (formData.clientId == null) {
                    formData.clientId = 0;
                }
                if (formData.supplierId == null) {
                    formData.supplierId = 0;
                }
                this.svcCreditFuel.get(formData.dateFrom, formData.dateTo, formData.clientId, formData.supplierId).subscribe(fuel => {
                    if (Object.keys(fuel).length > 0) {
                        this.fuelData = fuel;
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
            this.extractFuelData = this.getDataFromGrid();
            if (Object.keys(this.extractFuelData).length > 0) {
                this.ExportDatatoExcel(this.extractFuelData, 'CreditFuel.xlsx');
            }
            else {
                this.svcToaster.showWarning('No record found with your provided key value ');
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    getDataFromGrid() {
        let rowData = [];
        this.goFuel.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goFuel = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                sortable: true,
                filter: true,
                resizable: true
            },
            onRowDataChanged: () => { this.setFooter(); },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>',
        };
    }
    //#endregion
    //#region local functions'
    setFooter() {
        try {
            let _qty = 0, _amount = 0;
            this.goFuel.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.slipNo != undefined) {
                    _qty += rowNode.data.litre, _amount += rowNode.data.amount;
                }
            });
            this.goFuel.api.setPinnedBottomRowData([{
                    slipNo: null, slipDate: null, clientName: null, supplierName: null, jobNo: null, stateName: null, assetNo: null,
                    litre: _qty, amount: _amount
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
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
            this.svcCreditFuel.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstSupplier = data.lstSupplier;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmCreditFuel.reset();
        this.frmCreditFuel.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.errors = [];
        this.fuelData = [];
    }
};
CreditFuelComponent = __decorate([
    core_1.Component({
        selector: 'app-creditfuel',
        templateUrl: './creditfuel.component.html',
        styleUrls: ['./creditfuel.component.css']
    })
], CreditFuelComponent);
exports.CreditFuelComponent = CreditFuelComponent;
//# sourceMappingURL=creditfuel.component.js.map