"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let SupplierComponent = class SupplierComponent {
    constructor(router, formbulider, svcSupplier, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcSupplier = svcSupplier;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Supplier';
        this.colSearch = [
            { headerName: 'Id', field: 'supplierId', width: 70 },
            { headerName: 'Supplier Name', field: 'supplierName', },
            { headerName: 'Supplier Type', field: 'supplierTypeName' },
            { headerName: 'City', field: 'cityName' },
        ];
        this.footer = new footer_1.agFooter();
        this.errors = [];
        this.enableGLEntries = agFormHelper_1.agFormHelper.enableGL();
    }
    ngOnInit() {
        this.frmSupplier = this.formbulider.group({
            supplierId: [null, [forms_1.Validators.required]],
            supplierName: [null, [forms_1.Validators.required]],
            supplierTypeId: [null, [forms_1.Validators.required]],
            controlSupplierId: [null],
            scRate: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
            email: [null],
            cityId: [null],
            phoneNo: [null],
            mobileNo: [null],
            faxNo: [null],
            ntn: [null],
            url: [null],
            contactName: [null],
            isActive: [null],
            enableGLEntries: [null]
        });
        this.frmSupplier.disable();
        this.loadLookup();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmSupplier.patchValue({ enableGLEntries: this.enableGLEntries });
    }
    //#region toolbar functions
    tbAdd() {
        this.frmSupplier.reset();
        this.frmSupplier.enable();
        this.frmSupplier.controls.supplierId.disable();
        this.frmSupplier.patchValue({ isActive: true, enableGLEntries: this.enableGLEntries });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.supplierName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmSupplier.controls.supplierId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.supplierId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcSupplier.getSuppliers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Supplier", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.supplierId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmSupplier.enable();
        this.frmSupplier.controls.supplierId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        if (!this.enableGLEntries) {
            this.frmSupplier.controls.supplierName.disable();
            this.frmSupplier.controls.address.disable();
            this.frmSupplier.controls.isActive.disable();
            this.frmSupplier.controls.email.disable();
        }
        else
            this.supplierName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmSupplier.markAllAsTouched();
            if (!this.frmSupplier.invalid) {
                var formData = this.frmSupplier.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcSupplier.save(formData).subscribe(() => {
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
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcSupplier.get(Id).subscribe(supplier => {
                if (supplier) {
                    this.frmSupplier.disable();
                    this.frmSupplier.controls['supplierId'].setValue(supplier.supplierId);
                    this.frmSupplier.controls['supplierName'].setValue(supplier.supplierName);
                    this.frmSupplier.controls['supplierTypeId'].setValue(supplier.supplierTypeId);
                    this.frmSupplier.controls['controlSupplierId'].setValue(supplier.controlSupplierId);
                    this.frmSupplier.controls['scRate'].setValue(supplier.scRate);
                    this.frmSupplier.controls['address'].setValue(supplier.address);
                    this.frmSupplier.controls['email'].setValue(supplier.email);
                    this.frmSupplier.controls['cityId'].setValue(supplier.cityId);
                    this.frmSupplier.controls['phoneNo'].setValue(supplier.phoneNo);
                    this.frmSupplier.controls['mobileNo'].setValue(supplier.mobileNo);
                    this.frmSupplier.controls['faxNo'].setValue(supplier.faxNo);
                    this.frmSupplier.controls['ntn'].setValue(supplier.ntn);
                    this.frmSupplier.controls['url'].setValue(supplier.url);
                    this.frmSupplier.controls['contactName'].setValue(supplier.contactName);
                    this.frmSupplier.controls['isActive'].setValue(supplier.isActive);
                    this.frmSupplier.controls['enableGLEntries'].setValue(this.enableGLEntries);
                    this.footer = supplier.footer;
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
            this.svcSupplier.getLookup().subscribe(data => {
                this.lstCity = data.lstCity;
                this.lstSupplierType = data.lstSupplierType;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(s) {
        this.errors = [];
        let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
        let reEmail = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
        let reNTN = new RegExp('^[0-9]{7}-[0-9]{1}$');
        var rePhoneNo = new RegExp('^[0-9]{4}-[0-9]{6,7}$');
        if (s.controlSupplierId == null && !this.enableGLEntries) {
            this.errors.push('Control Supplier Id is required field');
        }
        if (s.mobileNo != '' && !reMobileNo.test(s.mobileNo)) {
            this.errors.push('Mobile # must be provided in valid format like xxxx-xxxxxxx');
        }
        if (s.phoneNo != '' && !rePhoneNo.test(s.phoneNo)) {
            this.errors.push('Phone # must be provided in valid format like xxxx-xxxxxxx');
        }
        if (s.email != '' && !reEmail.test(s.email)) {
            this.errors.push('Email must be provided in valid format like someone@somewhere.com');
        }
        if (s.ntn != '' && !reNTN.test(s.ntn)) {
            this.errors.push('NTN must be provided in valid format like xxxxxxx-x');
        }
    }
    initForm() {
        this.frmSupplier.reset();
        this.frmSupplier.patchValue({ enableGLEntries: this.enableGLEntries });
        this.frmSupplier.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('supplierName', { static: true })
], SupplierComponent.prototype, "supplierName", void 0);
__decorate([
    core_1.ViewChild('supplierId', { static: true })
], SupplierComponent.prototype, "supplierId", void 0);
SupplierComponent = __decorate([
    core_1.Component({
        selector: 'app-supplier',
        templateUrl: './supplier.component.html',
        styleUrls: ['./supplier.component.css']
    })
], SupplierComponent);
exports.SupplierComponent = SupplierComponent;
//# sourceMappingURL=supplier.component.js.map