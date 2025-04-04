"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortageComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let ShortageComponent = class ShortageComponent {
    constructor(router, formbulider, svcShortage, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcShortage = svcShortage;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Shortage';
        this.errors = [];
        //#endregion toolbar functions
        //#region grid setup
        //#region CF Grid Definition & functions
        this.colShortage = [
            {
                headerName: "Job #", field: "jobNo", editable: false, width: 100
            },
            {
                headerName: "Rwb #", field: "rwbNo", editable: false, width: 100
            },
            {
                headerName: "Jo Date", field: "jobCloseDate", editable: false, width: 100
            },
            {
                headerName: "Period", field: "period", editable: false, width: 100
            },
            {
                headerName: "Order #", field: "customerOrderNo", editable: false, width: 100
            },
            {
                headerName: "Gate Pas #", field: "gatePassNo", editable: false, width: 100
            },
            {
                headerName: "Asset #", field: "assetNo", editable: false, width: 100
            },
            {
                headerName: "capacity", field: "capacityName", editable: false, width: 100
            },
            {
                headerName: "Shipper", field: "shipperName", editable: false, width: 150
            },
            {
                headerName: "Consignee", field: "consigneeName", editable: false, width: 180
            },
            {
                headerName: "Qty", field: "shortageQuantity",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 80
            },
            {
                headerName: "Amount", field: "shortageAmount",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, editable: false, width: 80
            },
        ];
        this.loadLookup();
        this.initGrid();
        this.periodfrom = agFormHelper_1.agFormHelper.opsPeriodId();
        this.periodto = this.periodfrom;
    }
    ngOnInit() {
        this.frmShortage = this.formbulider.group({
            //DateBasicId: [null, [Validators.required]],
            periodFrom: [null, [forms_1.Validators.required]],
            periodTo: [null, [forms_1.Validators.required]],
            clientId: [null],
            assetId: [null]
            //JobPeriod: [null],
        });
        this.frmShortage.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
        this.shortageData = [];
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
            const formData = this.frmShortage.getRawValue();
            if (formData.periodFrom > formData.periodTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting extract request. Period From must always be lesser than or equal to Period To');
                return;
            }
            else {
                if (formData.clientId == null) {
                    formData.clientId = 0;
                }
                if (formData.assetId == null) {
                    formData.assetId = 0;
                }
                this.svcShortage.get(formData.periodFrom, formData.periodTo, formData.clientId, formData.assetId).subscribe(shortageData => {
                    if (Object.keys(shortageData).length > 0) {
                        this.shortageData = shortageData;
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
            this.extractShoratageData = this.getDataFromGrid();
            if (Object.keys(this.extractShoratageData).length > 0) {
                this.ExportDatatoExcel(this.extractShoratageData, 'Shortage.xlsx');
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
        this.goShortage.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goShortage = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            ////columnDefs: this.colShortage,
            ////rowData: [],
            //rowSelection: 'single',
            //rowDeselection: true,
            //floatingFilter: true,
            //enableColResize: true,
            //singleClickEdit: false,
            //suppressCellSelection: false,
            //overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            //overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'     
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
    loadLookup() {
        try {
            this.svcShortage.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
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
        this.frmShortage.reset();
        this.errors = [];
        this.frmShortage.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
        this.extractShoratageData = [];
        this.shortageData = [];
    }
};
ShortageComponent = __decorate([
    core_1.Component({
        selector: 'app-shortage',
        templateUrl: './shortage.component.html',
        styleUrls: ['./shortage.component.css']
    })
], ShortageComponent);
exports.ShortageComponent = ShortageComponent;
//# sourceMappingURL=shortage.component.js.map