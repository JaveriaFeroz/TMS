"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WOExtractComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let WOExtractComponent = class WOExtractComponent {
    constructor(router, formbulider, 
    //private inventoryadjustmentService: InventoryAdjustmentService,
    svcWOExtract, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWOExtract = svcWOExtract;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'List of Work Orders & Service Request';
        this.model = {};
        this.errors = [];
        this.MinDate = new Date();
        this.MaxDate = new Date();
        this.Date = new Date();
        this.loadLookup();
        this.periodfrom = agFormHelper_1.agFormHelper.opsPeriodId();
        this.periodto = this.periodfrom;
        this.MinDate.setDate(this.Date.getDate() - 360);
    }
    ngOnInit() {
        this.frmWOExtract = this.formbulider.group({
            selection: ["1", [forms_1.Validators.required]],
            periodFrom: [null],
            periodTo: [null],
            dateFrom: [null],
            dateTo: [null],
        });
        this.frmWOExtract.patchValue({ selection: "1", periodFrom: this.periodfrom, periodTo: this.periodto, dateFrom: new Date(), dateTo: new Date() });
    }
    //#region toolbar functions
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbUndo() {
        this.frmWOExtract.reset();
    }
    tbExport() {
        try {
            var formData = this.frmWOExtract.getRawValue();
            //if (formData.DateFrom === '01011970') {
            //  formData.DateFrom = "";
            //}
            //if (formData.DateTo === '01011970') {
            //  formData.DateTo = "";
            //}
            //frmWOExtract.companyid = JSON.parse(sessionStorage.getItem("CompanyId"));
            this.validate(formData);
            if (this.errors.length > 0) {
                this.errors;
                return;
            }
            else {
                if (formData.selection == 1) {
                    //frmWOExtract.DateFrom = formatDate(frmWOExtract.DateFrom, 'dd-MM-yyyy', 'en-US');
                    //frmWOExtract.DateTo = formatDate(frmWOExtract.DateTo, 'dd-MM-yyyy', 'en-US');
                    this.svcWOExtract.getPendingRequest(formData.dateFrom, formData.dateTo).subscribe((PC) => {
                        if (Object.keys(PC).length > 0) {
                            this.ExportDatatoExcel(PC, 'PendingServiceRequest.xlsx');
                            this.frmWOExtract.reset();
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value ');
                        }
                    }, (error) => { this.errors.push(error); });
                }
                else if (formData.selection == 2) {
                    //frmWOExtract.DateFrom = formatDate(frmWOExtract.DateFrom, 'dd-MM-yyyy', 'en-US');
                    //frmWOExtract.DateTo = formatDate(frmWOExtract.DateTo, 'dd-MM-yyyy', 'en-US');
                    this.svcWOExtract.getPending(formData.dateFrom, formData.dateTo).subscribe((PWO) => {
                        if (Object.keys(PWO).length > 0) {
                            this.ExportDatatoExcel(PWO, 'PendingWO.xlsx');
                            this.frmWOExtract.reset();
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value ');
                        }
                    }, (error) => { this.errors.push(error); });
                }
                else if (formData.selection == 3) {
                    this.svcWOExtract.getClosed(formData.periodFrom, formData.periodTo).subscribe((CWO) => {
                        if (Object.keys(CWO).length > 0) {
                            this.ExportDatatoExcel(CWO, 'ClosedWO.xlsx');
                            this.frmWOExtract.reset();
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value ');
                        }
                        //this.excelService.exportAsExcelFile(data, 'ClosedWO');
                        //const ws: xlsx.WorkSheet =
                        //xlsx.utils.table_to_sheet(data);
                        //const wb: xlsx.WorkBook = xlsx.utils.book_new();
                        //xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
                        //xlsx.writeFile(wb, 'ClosedWO.xlsx');                    
                    }, (error) => { this.svcToaster.showFailure(error); });
                }
                this.frmWOExtract.patchValue({ selection: "1", periodFrom: this.periodfrom, periodTo: this.periodto, dateFrom: new Date(), dateTo: new Date() });
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
    loadLookup() {
        try {
            this.svcWOExtract.getLookup().subscribe(data => {
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
        if (woe.selection < 3) {
            if (woe.dateTo == "" || woe.dateFrom == "") {
                this.errors.push('please select valid Date From & Date To before hitting Download button');
            }
            if (woe.dateTo < woe.dateFrom) {
                this.errors.push('Date From must always be older than Date To. Please correct your date range criteria and entry');
            }
        }
        else {
            if (woe.periodFrom == null || woe.periodTo == null) {
                this.errors.push('Please enter valid Period From & Period To before hitting Download button');
            }
            else if (woe.periodFrom > woe.periodTo) {
                this.errors.push('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
            }
        }
    }
};
WOExtractComponent = __decorate([
    core_1.Component({
        selector: 'app-woextract',
        templateUrl: './woextract.component.html',
        styleUrls: ['./woextract.component.css']
    })
], WOExtractComponent);
exports.WOExtractComponent = WOExtractComponent;
//# sourceMappingURL=woextract.component.js.map