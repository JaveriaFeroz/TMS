"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WOReImbursementExtractComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let WOReImbursementExtractComponent = class WOReImbursementExtractComponent {
    constructor(router, formbulider, svcWOReImbursement, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWOReImbursement = svcWOReImbursement;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Work Order ReImbursement Extract';
        this.errors = [];
        this.loadLookup();
        this.periodfrom = agFormHelper_1.agFormHelper.opsPeriodId();
        this.periodto = this.periodfrom;
    }
    ngOnInit() {
        this.frmWOReImbursementExtract = this.formbulider.group({
            supplierId: [null],
            branchId: [null],
            subCategoryId: [null],
            periodFrom: [null, [forms_1.Validators.required]],
            periodTo: [null, [forms_1.Validators.required]],
        });
        this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
    }
    //#region toolbar functions
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbUndo() {
        this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
        this.frmWOReImbursementExtract.reset();
    }
    tbExport() {
        try {
            this.frmWOReImbursementExtract.markAllAsTouched();
            const formData = this.frmWOReImbursementExtract.getRawValue();
            this.validate(formData);
            if (this.errors.length > 0) {
                this.errors;
                return;
            }
            else {
                if (formData.subCategoryId == null) {
                    formData.subCategoryId = 0;
                }
                if (formData.supplierId == null) {
                    formData.supplierId = 0;
                }
                this.svcWOReImbursement.get(formData.branchId, formData.supplierId, formData.subCategoryId, formData.periodFrom, formData.periodTo).subscribe((WOReimb) => {
                    if (Object.keys(WOReimb).length > 0) {
                        this.ExportDatatoExcel(WOReimb, 'WOReImbursement.xlsx');
                        this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
                        this.frmWOReImbursementExtract.reset();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value ');
                    }
                    //this.excelService.exportAsExcelFile(data, 'PendingComplaint');
                    //const ws: xlsx.WorkSheet =
                    //xlsx.utils.table_to_sheet(data);
                    //const wb: xlsx.WorkBook = xlsx.utils.book_new();
                    //xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
                    //xlsx.writeFile(wb, 'PendingComplaint.xlsx');
                }, (error) => { this.svcToaster.showFailure(error); });
            }
            this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
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
    loadLookup() {
        try {
            this.svcWOReImbursement.getLookup().subscribe(data => {
                this.lstBranch = data.lstBranch;
                this.lstSupplier = data.lstSupplier;
                this.lstSubCategory = data.lstSubCategory;
                this.lstPeriod = data.lstPeriod;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(woe) {
        this.errors = [];
        if (woe.periodFrom > woe.periodTo) {
            this.errors.push('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
        }
    }
};
WOReImbursementExtractComponent = __decorate([
    core_1.Component({
        selector: 'app-woreimbursementextract',
        templateUrl: './woreimbursementextract.component.html',
        styleUrls: ['./woreimbursementextract.component.css']
    })
], WOReImbursementExtractComponent);
exports.WOReImbursementExtractComponent = WOReImbursementExtractComponent;
//# sourceMappingURL=woreimbursementextract.component.js.map