"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const footer_1 = require("../../helper/footer");
let UnInvoiceComponent = class UnInvoiceComponent {
    constructor(router, formbulider, svcUnInvoice, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcUnInvoice = svcUnInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Un Invoice';
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmUnInvoice = this.formbulider.group({
            invoiceNo: [null, [forms_1.Validators.required]],
        });
    }
    //#region toolbar functions
    tbSave() {
        try {
            this.frmUnInvoice.markAllAsTouched();
            if (!this.frmUnInvoice.invalid) {
                var formData = this.frmUnInvoice.getRawValue();
                this.svcWaitDlg.open({});
                this.svcUnInvoice.unInvoice(formData.invoiceNo).subscribe(() => {
                    this.initForm();
                    this.svcToaster.showSuccess('Un invoice saved ');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    initForm() {
        this.frmUnInvoice.reset();
        this.errors = [];
    }
};
UnInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-uninvoice',
        templateUrl: './uninvoice.component.html',
        styleUrls: ['./uninvoice.component.css']
    })
], UnInvoiceComponent);
exports.UnInvoiceComponent = UnInvoiceComponent;
//# sourceMappingURL=uninvoice.component.js.map