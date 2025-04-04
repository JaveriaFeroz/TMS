"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChequeBookComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ChequeBookComponent = class ChequeBookComponent {
    //#endregion
    constructor(router, formbulider, svcChqBook, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcChqBook = svcChqBook;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        //#region form variables
        this.optionName = 'Cheque Book';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date().setDate(new Date().getDate() - 30);
        this.maxDate = new Date();
        this.colSearch = [
            { headerName: "Book Id", field: "bookId", width: 60 },
            { headerName: "Cheque Book Name", field: "bookName", width: 150 },
            { headerName: "Bank Name", field: "accountName", width: 150 },
            { headerName: "Start Chq #", field: "startChqNo", width: 120 },
            { headerName: "End Chq #", field: "endChqNo", width: 120 }
        ];
        this.loadLookup();
    }
    ngOnInit() {
        this.frmCB = this.formbulider.group({
            bookId: [null, [forms_1.Validators.required]],
            bookName: [null, [forms_1.Validators.required]],
            accountId: [null, [forms_1.Validators.required]],
            issueDate: [null, [forms_1.Validators.required]],
            prefix: [null],
            startChqNo: [null, [forms_1.Validators.required]],
            endChqNo: [null, [forms_1.Validators.required]],
        });
        this.frmCB.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCB.reset();
        this.frmCB.enable();
        this.frmCB.controls.bookId.disable();
        this.frmCB.patchValue({ issueDate: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.bookName.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcChqBook.getBooks().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Cheque Book", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.bookId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.frmCB.controls.bookId.enable();
        this.bookId.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmCB.markAllAsTouched();
            if (!this.frmCB.invalid) {
                var formData = this.frmCB.getRawValue();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcChqBook.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(id) {
        this.svcWaitDlg.open({});
        try {
            this.svcChqBook.get(id).subscribe(cb => {
                if (cb) {
                    this.frmCB.disable();
                    this.frmCB.controls['bookId'].setValue(cb.bookId);
                    this.frmCB.controls['bookName'].setValue(cb.bookName);
                    this.frmCB.controls['accountId'].setValue(cb.accountId);
                    this.frmCB.controls['issueDate'].setValue(new Date(cb.issueDate));
                    this.frmCB.controls['prefix'].setValue(cb.prefix);
                    this.frmCB.controls['startChqNo'].setValue(cb.startChqNo);
                    this.frmCB.controls['endChqNo'].setValue(cb.endChqNo);
                    this.footer = cb.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
    loadLookup() {
        try {
            this.svcChqBook.getLookup().subscribe(data => {
                this.lstBankAccount = data.lstBankAccount;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(cb) {
        this.errors = [];
        if (cb.startChqNo > cb.endChqNo) {
            this.errors.push('End cheque # of the book must be higher than start cheque #');
        }
        if (cb.endChqNo - cb.startChqNo > 99) {
            this.errors.push('Cheque book can`t contain more than 100 leaves in single book');
        }
    }
    initForm() {
        this.frmCB.reset();
        this.frmCB.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('bookName', { static: true })
], ChequeBookComponent.prototype, "bookName", void 0);
__decorate([
    core_1.ViewChild('bookId', { static: true })
], ChequeBookComponent.prototype, "bookId", void 0);
ChequeBookComponent = __decorate([
    core_1.Component({
        selector: 'app-chequebook',
        templateUrl: './chequebook.component.html',
        styleUrls: ['./chequebook.component.css']
    })
], ChequeBookComponent);
exports.ChequeBookComponent = ChequeBookComponent;
//# sourceMappingURL=chequebook.component.js.map