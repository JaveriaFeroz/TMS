"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let InvoiceComponent = class InvoiceComponent {
    constructor(router, formbulider, svcInvoice, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvoice = svcInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region constant variables
        this.optionName = 'Generate Invoice';
        this.errors = [];
        this.MinDate = new Date(new Date().getDate() - 30);
        this.MaxDate = new Date();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmInvoice = this.formbulider.group({
            clientId: [null, [forms_1.Validators.required]],
            invoiceFrom: [null, [forms_1.Validators.required]],
            invoiceTo: [null, [forms_1.Validators.required]],
            reapplyRate: [null],
            taxRate: [null],
        });
        this.frmInvoice.enable();
        //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
        this.frmInvoice.patchValue({ InvoiceFrom: new Date(), InvoiceTo: new Date(), reapplyRate: false });
    }
    //#region toolbar functions
    tbSave() {
        this.svcWaitDlg.open({});
        try {
            this.frmInvoice.markAllAsTouched();
            if (!this.frmInvoice.invalid) {
                var formData = this.frmInvoice.getRawValue();
                if (formData.invoiceFrom > formData.invoiceTo) {
                    this.svcToaster.showFailure('Invoice From Date cannot  be less then  Invoice To');
                    return;
                }
                else {
                    this.svcInvoice.generate(formData.clientId, formData.invoiceFrom, formData.invoiceTo, formData.reapplyRate, formData.taxRate).subscribe(data => {
                        this.initForm();
                        if (data.invoiceCount > 0) {
                            this.svcToaster.showSuccess(data.invoiceCount + ' Invoices Generated Successfully');
                        }
                        else {
                            this.svcToaster.showFailure('No Invoice Generated');
                        }
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
        //  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    loadLookup() {
        try {
            this.svcInvoice.getClients().subscribe(data => {
                this.lstClient = data;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    onChange(event) {
        var Client = this.lstClient;
        var Tax = Client.filter(function (item) { return item.clientId == event; }).map(function (Client) { return Client.taxRate; });
        this.frmInvoice.controls['taxRate'].setValue(Tax[0]);
    }
    initForm() {
        this.frmInvoice.reset();
        // this.frmInvoice.disable();
        this.errors = [];
        this.frmInvoice.patchValue({ InvoiceFrom: new Date(), InvoiceTo: new Date() });
    }
};
__decorate([
    core_1.ViewChild('clientid', { static: true })
], InvoiceComponent.prototype, "clientid", void 0);
InvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-generateinvoice',
        templateUrl: './generateinvoice.component.html',
        styleUrls: ['./generateinvoice.component.css']
    })
], InvoiceComponent);
exports.InvoiceComponent = InvoiceComponent;
//# sourceMappingURL=generateinvoice.component.js.map