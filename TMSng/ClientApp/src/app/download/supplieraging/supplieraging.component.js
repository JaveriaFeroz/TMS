"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierAgingComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let SupplierAgingComponent = class SupplierAgingComponent {
    constructor(router, formbulider, svcSupplierAging, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcSupplierAging = svcSupplierAging;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Supplier Aging';
        this.model = {};
        this.errors = [];
        this.MinDate = new Date(new Date(new Date().getDate() - 30));
        this.MaxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region CF Grid Definition & functions
        this.colSupplierAging = [
            {
                headerName: "Supplier", field: "supplierName", editable: false, width: 200
            },
            {
                headerName: "Credit Days", field: "creditDays", editable: false, width: 100
            },
            {
                headerName: "Not Yet Due", field: "notYetdue", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDue1To15", field: "overDue1To15", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDue16To30", field: "overDue16To30", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDue31To60", field: "overDue31To60", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDue61To90", field: "overDue61To90", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDue91To120", field: "overDue91To120", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 120
            },
            {
                headerName: "OverDueAbove120", field: "overDueAbove120", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 130
            },
        ];
        this.initGrid();
    }
    ngOnInit() {
        this.frmSupplierAging = this.formbulider.group({
            dateUpto: [null, [forms_1.Validators.required]],
        });
        this.frmSupplierAging.patchValue({ dateUpto: new Date() });
        this.supplierAgingData = [];
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
            const form = this.frmSupplierAging.getRawValue();
            this.svcSupplierAging.get(form.dateUpto).subscribe(supplieraging => {
                if (Object.keys(supplieraging).length > 0) {
                    this.supplierAgingData = supplieraging;
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
    tbExport() {
        try {
            this.extractSupplierAgingData = this.getDataFromGrid();
            if (Object.keys(this.extractSupplierAgingData).length > 0) {
                this.ExportDatatoExcel(this.extractSupplierAgingData, 'SupplierAging.xlsx');
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
        this.goSupplierAging.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goSupplierAging = {
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
    initForm() {
        this.frmSupplierAging.reset();
        this.frmSupplierAging.patchValue({ dateUpto: new Date() });
        this.errors = [];
        /*    this.goSupplierAging.api.setRowData([]);*/
        this.supplierAgingData = [];
        this.extractSupplierAgingData = [];
    }
};
SupplierAgingComponent = __decorate([
    core_1.Component({
        selector: 'app-supplieraging',
        templateUrl: './supplieraging.component.html',
        styleUrls: ['./supplieraging.component.css']
    })
], SupplierAgingComponent);
exports.SupplierAgingComponent = SupplierAgingComponent;
//# sourceMappingURL=supplieraging.component.js.map