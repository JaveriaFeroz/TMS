"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ProductTypeComponent = class ProductTypeComponent {
    constructor(router, formbulider, svcProductType, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcProductType = svcProductType;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Product Type';
        this.colSearch = [
            { headerName: 'Type Id', field: 'typeId', width: 70 },
            { headerName: 'Type Name', field: 'typeName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmProductType = this.formbulider.group({
            typeId: [null, [forms_1.Validators.required]],
            typeName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmProductType.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmProductType.reset();
        this.frmProductType.enable();
        this.frmProductType.controls.typeId.disable();
        this.frmProductType.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.productTypeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmProductType.controls.typeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.productTypeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcProductType.getProductTypes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Product Type", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.typeId);
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
        this.frmProductType.enable();
        this.frmProductType.controls.typeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.productTypeName.nativeElement.focus();
    }
    tbSave() {
        this.frmProductType.markAllAsTouched();
        if (!this.frmProductType.invalid) {
            this.svcWaitDlg.open({});
            var formData = this.frmProductType.getRawValue();
            formData.footer = this.footer;
            this.svcProductType.save(formData).subscribe(() => {
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                this.svcToaster.showSuccess('Record saved Successfully');
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcProductType.get(Id).subscribe(producttype => {
                if (producttype) {
                    this.frmProductType.disable();
                    this.frmProductType.controls['typeId'].setValue(producttype.typeId);
                    this.frmProductType.controls['typeName'].setValue(producttype.typeName);
                    this.frmProductType.controls['isActive'].setValue(producttype.isActive);
                    this.footer = producttype.footer;
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
    initForm() {
        this.frmProductType.reset();
        this.frmProductType.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('productTypeName', { static: true })
], ProductTypeComponent.prototype, "productTypeName", void 0);
__decorate([
    core_1.ViewChild('productTypeId', { static: true })
], ProductTypeComponent.prototype, "productTypeId", void 0);
ProductTypeComponent = __decorate([
    core_1.Component({
        selector: 'app-producttype',
        templateUrl: './producttype.component.html',
        styleUrls: ['./producttype.component.css']
    })
], ProductTypeComponent);
exports.ProductTypeComponent = ProductTypeComponent;
//# sourceMappingURL=producttype.component.js.map