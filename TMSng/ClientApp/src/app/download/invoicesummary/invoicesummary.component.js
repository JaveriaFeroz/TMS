"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InoviceSummaryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let InoviceSummaryComponent = class InoviceSummaryComponent {
    constructor(router, formbulider, svcInvSummary, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvSummary = svcInvSummary;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Invoice Summary';
        this.model = {};
        this.errors = [];
        this.Date = new Date();
        this.MinDate = new Date();
        this.MaxDate = new Date();
        //#region grid setup
        //#region Invoice Summary Grid Definition & functions
        this.colInvoiceSummary = [
            {
                headerName: "Invoice #", field: "invoiceNo", editable: false, width: 120
            },
            {
                headerName: "Invoice Date", field: "invoiceDate", editable: false, width: 100
            },
            {
                headerName: "Id", field: "clientId", editable: false, width: 80
            },
            {
                headerName: "Name", field: "clientName", editable: false, width: 200
            },
            {
                headerName: "Gross Amt", field: "grossAmount",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            //{
            //  headerName: "Gst %", field: "gstPercentage",
            //  valueFormatter: agGridHelper.formatNumbers,
            //  valueParser: agGridHelper.numberValueParser, editable: false, width: 100
            //},
            {
                headerName: "Gst Amt", field: "gstAmount",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Total Amt", field: "totalAmount",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 100
            },
            {
                headerName: "Invoice Month", field: "invoiceMonth", editable: false, width: 100
            },
            {
                headerName: "Invoice From", field: "invoiceFrom", editable: false, width: 120
            },
            {
                headerName: "Invoice To", field: "invoiceTo", editable: false, width: 120
            },
            {
                headerName: "WorkFlowName", field: "workFlowName", editable: false, width: 170
            },
        ];
        this.initGrid();
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmInvoiceSummary = this.formbulider.group({
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]]
        });
        this.frmInvoiceSummary.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        this.invoiceSummaryData = [];
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
            this.frmInvoiceSummary.markAllAsTouched();
            this.svcWaitDlg.open({});
            var formData = this.frmInvoiceSummary.getRawValue();
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
                return;
            }
            else {
                this.svcInvSummary.get(formData.dateFrom, formData.dateTo).subscribe(invoicesummary => {
                    if (Object.keys(invoicesummary).length != 0) {
                        this.invoiceSummaryData = invoicesummary;
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
            this.svcWaitDlg.close();
        }
    }
    tbExport() {
        try {
            this.extractInvoiceSummaryData = this.getDataFromGrid();
            if (Object.keys(this.extractInvoiceSummaryData).length > 0) {
                this.ExportDatatoExcel(this.extractInvoiceSummaryData, 'InvoiceSummary.xlsx');
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
        this.goInvoiceSummary.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goInvoiceSummary = {
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
        //this.frmInvoiceSummary.reset();
        this.frmInvoiceSummary.patchValue({ DateFrom: new Date(), DateTo: new Date() });
        this.errors = [];
        //this.goInvoiceSummary.api.setRowData([]);
        this.invoiceSummaryData = [];
    }
};
InoviceSummaryComponent = __decorate([
    core_1.Component({
        selector: 'app-invoicesummary',
        templateUrl: './invoicesummary.component.html',
        styleUrls: ['./invoicesummary.component.css']
    })
], InoviceSummaryComponent);
exports.InoviceSummaryComponent = InoviceSummaryComponent;
//# sourceMappingURL=invoicesummary.component.js.map